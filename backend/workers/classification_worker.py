from __future__ import annotations

from sqlalchemy import select

from app.core.celery_app import celery_app
from app.modules.documents.models import Document, DocumentPage, DocumentType
from app.modules.extraction.models import ExtractionJob
from app.shared.models.enums import DocumentStatus, PipelineStage
from app.shared.utils.idempotency import make_idempotency_key
from ai_pipeline.classification.classifier import classify_document
from workers.base_worker import execute_stage, run_async


async def _handle_classification(*, session, document: Document) -> dict:
    pages = (await session.scalars(select(DocumentPage).where(DocumentPage.document_id == document.id))).all()
    text = "".join(f"\n{page.ocr_text or ''}" for page in pages)
    classification = classify_document(document.original_filename, text)
    document.classification_confidence = classification["confidence"]
    doc_type = await session.scalar(
        select(DocumentType).where(
            (DocumentType.org_id == document.org_id) | (DocumentType.org_id.is_(None)),
            DocumentType.name == classification["document_type"],
        )
    )
    if doc_type:
        document.document_type_id = doc_type.id
    document.status = (
        DocumentStatus.REVIEW_REQUIRED if classification["confidence"] < 0.65 else DocumentStatus.EXTRACTION_PENDING
    )
    if document.status == DocumentStatus.EXTRACTION_PENDING:
        session.add(
            ExtractionJob(
                document_id=document.id,
                org_id=document.org_id,
                pipeline_stage=PipelineStage.EXTRACTION,
                idempotency_key=make_idempotency_key(document.id, PipelineStage.EXTRACTION, 1),
            )
        )
    await session.commit()
    if document.status == DocumentStatus.EXTRACTION_PENDING:
        celery_app.send_task("workers.extraction_worker.run_extraction", kwargs={"document_id": document.id})
    return classification


@celery_app.task(name="workers.classification_worker.run_classification")
def run_classification(document_id: str) -> dict:
    return run_async(execute_stage(document_id=document_id, stage=PipelineStage.CLASSIFICATION, handler=_handle_classification))
