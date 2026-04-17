from __future__ import annotations

from datetime import datetime, timezone
from pathlib import PurePosixPath

from sqlalchemy import Select, and_, func, or_, select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload
from uuid6 import uuid7

from app.core.audit import write_audit_log
from app.core.celery_app import celery_app
from app.core.http import bad_request, not_found
from app.core.settings import get_settings
from app.core.storage import storage_service
from app.modules.auth.models import User
from app.modules.documents.models import Document, DocumentPage, DocumentType, OCRSample
from app.modules.documents.schemas import (
    ApproveDocumentRequest,
    CorrectFieldRequest,
    DocumentDetail,
    DocumentSummary,
    RejectDocumentRequest,
    UploadUrlRequest,
    UploadUrlResponse,
)
from app.modules.extraction.models import ExtractedField, ExtractionJob
from app.modules.feedback.models import FeedbackEntry
from app.modules.validation.models import ValidationResult
from app.shared.models.enums import DocumentStatus, FeedbackType, PipelineStage
from app.shared.schemas.common import PaginatedResponse
from app.shared.utils.idempotency import make_idempotency_key
from app.shared.utils.pagination import paginate


SUPPORTED_FORMATS = {"pdf", "png", "jpg", "jpeg", "tiff", "docx", "xlsx", "html"}
CONTENT_TYPES = {
    "pdf": "application/pdf",
    "png": "image/png",
    "jpg": "image/jpeg",
    "jpeg": "image/jpeg",
    "tiff": "image/tiff",
    "docx": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "xlsx": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    "html": "text/html",
}


def assert_document_access(document: Document, user: User) -> None:
    if document.org_id != user.org_id:
        raise not_found("Document not found")
    if document.access_level != "ORG" and user.id not in (document.allowed_user_ids or []):
        raise not_found("Document not found")


async def create_upload_url(session: AsyncSession, payload: UploadUrlRequest, user: User) -> UploadUrlResponse:
    settings = get_settings()
    file_format = payload.file_format.lower()
    if file_format not in SUPPORTED_FORMATS:
        raise bad_request("Unsupported file format")
    if payload.file_size_bytes > settings.max_upload_size_mb * 1024 * 1024:
        raise bad_request("File exceeds maximum allowed size")

    doc_id = str(uuid7())
    now = datetime.now(timezone.utc)
    object_key = str(
        PurePosixPath(
            user.org_id,
            str(now.year),
            f"{now.month:02d}",
            doc_id,
            payload.filename,
        )
    )
    document = Document(
        id=doc_id,
        org_id=user.org_id,
        document_type_id=payload.document_type_id,
        original_filename=payload.filename,
        file_format=file_format,
        file_size_bytes=payload.file_size_bytes,
        raw_s3_key=object_key,
        status=DocumentStatus.PENDING,
        uploaded_by=user.id,
        tags=payload.tags,
        custom_metadata=payload.custom_metadata,
    )
    session.add(document)
    await session.flush()

    upload = storage_service.create_presigned_upload(object_key, CONTENT_TYPES[file_format])
    await write_audit_log(
        session,
        org_id=user.org_id,
        user_id=user.id,
        action="document.upload_url.create",
        resource_type="document",
        resource_id=document.id,
        after_state={"object_key": object_key},
    )
    await session.commit()
    return UploadUrlResponse(document_id=document.id, upload_url=upload["upload_url"], object_key=object_key)


async def confirm_upload(session: AsyncSession, document_id: str, user: User) -> dict[str, str | int]:
    document = await session.get(Document, document_id)
    if not document:
        raise not_found("Document not found")
    assert_document_access(document, user)
    if not storage_service.object_exists(document.raw_s3_key):
        raise bad_request("Uploaded file not found in storage")

    document.status = DocumentStatus.PREPROCESSING
    job = ExtractionJob(
        document_id=document.id,
        org_id=document.org_id,
        pipeline_stage=PipelineStage.PREPROCESSING,
        idempotency_key=make_idempotency_key(document.id, PipelineStage.PREPROCESSING, 1),
    )
    session.add(job)
    await write_audit_log(
        session,
        org_id=document.org_id,
        user_id=user.id,
        action="document.confirm_upload",
        resource_type="document",
        resource_id=document.id,
        after_state={"status": document.status},
    )
    await session.commit()
    celery_app.send_task("workers.preprocessing_worker.run_preprocessing", kwargs={"document_id": document.id})
    return {"document_id": document.id, "status": document.status, "estimated_processing_time_seconds": 30}


async def list_documents(
    session: AsyncSession,
    user: User,
    *,
    status: str | None,
    document_type_id: str | None,
    page: int,
    page_size: int,
) -> PaginatedResponse[DocumentSummary]:
    window = paginate(page, page_size)
    query: Select[tuple[Document]] = select(Document).where(Document.org_id == user.org_id)
    if status:
        query = query.where(Document.status == status)
    if document_type_id:
        query = query.where(Document.document_type_id == document_type_id)
    total = await session.scalar(select(func.count()).select_from(query.subquery())) or 0
    records = (
        await session.scalars(
            query.order_by(Document.created_at.desc()).offset(window.offset).limit(window.page_size)
        )
    ).all()
    items = [DocumentSummary.model_validate(record) for record in records]
    return PaginatedResponse(items=items, total=total, page=page, page_size=page_size, has_more=total > page * page_size)


async def get_document_detail(session: AsyncSession, document_id: str, user: User) -> DocumentDetail:
    query = (
        select(Document)
        .where(Document.id == document_id, Document.org_id == user.org_id)
        .options(
            selectinload(Document.pages),
        )
    )
    document = await session.scalar(query)
    if not document:
        raise not_found("Document not found")
    assert_document_access(document, user)

    extracted_fields = (
        await session.scalars(select(ExtractedField).where(ExtractedField.document_id == document.id))
    ).all()
    validation_results = (
        await session.scalars(select(ValidationResult).where(ValidationResult.document_id == document.id))
    ).all()
    return DocumentDetail(
        **DocumentSummary.model_validate(document).model_dump(),
        page_count=document.page_count,
        classification_confidence=document.classification_confidence,
        tags=document.tags or [],
        extracted_fields=extracted_fields,
        validation_results=validation_results,
    )


async def get_page_view_url(session: AsyncSession, document_id: str, page_number: int, user: User) -> dict[str, str]:
    page = await session.scalar(
        select(DocumentPage)
        .join(Document, Document.id == DocumentPage.document_id)
        .where(Document.id == document_id, Document.org_id == user.org_id, DocumentPage.page_number == page_number)
    )
    if not page or not page.processed_image_s3_key:
        raise not_found("Page image not found")
    return {"url": storage_service.create_presigned_download(page.processed_image_s3_key)}


async def get_page_ocr(session: AsyncSession, document_id: str, page_number: int, user: User) -> dict:
    output = await session.scalar(
        select(OCRSample)
        .join(DocumentPage, DocumentPage.id == OCRSample.page_id)
        .join(Document, Document.id == DocumentPage.document_id)
        .where(Document.id == document_id, Document.org_id == user.org_id, DocumentPage.page_number == page_number)
    )
    if not output:
        raise not_found("OCR output not found")
    return output.payload


async def get_extractions(session: AsyncSession, document_id: str, user: User) -> dict:
    document = await session.get(Document, document_id)
    if not document:
        raise not_found("Document not found")
    assert_document_access(document, user)
    fields = (
        await session.scalars(
            select(ExtractedField).where(ExtractedField.document_id == document.id).order_by(ExtractedField.field_name)
        )
    ).all()
    return {
        "document_id": document.id,
        "document_type_id": document.document_type_id,
        "extraction_confidence": document.overall_extraction_confidence,
        "fields": fields,
    }


async def correct_extracted_field(
    session: AsyncSession,
    document_id: str,
    field_id: str,
    payload: CorrectFieldRequest,
    user: User,
) -> ExtractedField:
    field = await session.scalar(
        select(ExtractedField).where(
            ExtractedField.id == field_id,
            ExtractedField.document_id == document_id,
            ExtractedField.org_id == user.org_id,
        )
    )
    if not field:
        raise not_found("Field not found")
    original = field.normalized_value or {"value": field.raw_value}
    field.raw_value = payload.corrected_value
    field.normalized_value = {"value": payload.corrected_value}
    field.is_reviewed = True
    field.is_corrected = True
    field.reviewed_by = user.id
    field.reviewed_at = datetime.now(timezone.utc)
    session.add(
        FeedbackEntry(
            org_id=user.org_id,
            user_id=user.id,
            feedback_type=FeedbackType.FIELD_CORRECTION,
            document_id=document_id,
            extracted_field_id=field.id,
            original_value=original,
            corrected_value=field.normalized_value,
            correction_reason=payload.correction_reason,
            confidence_at_extraction=field.confidence,
        )
    )
    await write_audit_log(
        session,
        org_id=user.org_id,
        user_id=user.id,
        action="field.override",
        resource_type="extracted_field",
        resource_id=field.id,
        before_state=original,
        after_state=field.normalized_value,
    )
    await session.commit()
    await session.refresh(field)
    return field


async def get_validation_results(session: AsyncSession, document_id: str, user: User) -> dict:
    document = await session.get(Document, document_id)
    if not document:
        raise not_found("Document not found")
    assert_document_access(document, user)
    results = (await session.scalars(select(ValidationResult).where(ValidationResult.document_id == document.id))).all()
    return {
        "status": document.validation_status,
        "rules_evaluated": len(results),
        "rules_passed": sum(1 for result in results if result.status == "PASSED"),
        "rules_failed": sum(1 for result in results if result.status == "FAILED"),
        "results": results,
    }


async def approve_document(
    session: AsyncSession,
    document_id: str,
    payload: ApproveDocumentRequest,
    user: User,
) -> dict:
    document = await session.get(Document, document_id)
    if not document:
        raise not_found("Document not found")
    assert_document_access(document, user)
    before = {"status": document.status}
    document.status = DocumentStatus.APPROVED
    await write_audit_log(
        session,
        org_id=user.org_id,
        user_id=user.id,
        action="document.approve",
        resource_type="document",
        resource_id=document.id,
        before_state=before,
        after_state={"status": document.status, "comments": payload.comments},
    )
    await session.commit()
    celery_app.send_task("workers.workflow_worker.run_workflows", kwargs={"document_id": document.id})
    return {"document_id": document.id, "status": document.status}


async def reject_document(
    session: AsyncSession,
    document_id: str,
    payload: RejectDocumentRequest,
    user: User,
) -> dict:
    document = await session.get(Document, document_id)
    if not document:
        raise not_found("Document not found")
    assert_document_access(document, user)
    document.status = DocumentStatus.REJECTED
    await write_audit_log(
        session,
        org_id=user.org_id,
        user_id=user.id,
        action="document.reject",
        resource_type="document",
        resource_id=document.id,
        after_state={"status": document.status, "reason": payload.reason},
    )
    await session.commit()
    return {"document_id": document.id, "status": document.status}


async def review_queue(session: AsyncSession, user: User, page: int, page_size: int) -> PaginatedResponse[DocumentSummary]:
    return await list_documents(
        session,
        user,
        status=DocumentStatus.REVIEW_REQUIRED,
        document_type_id=None,
        page=page,
        page_size=page_size,
    )

