from __future__ import annotations

from sqlalchemy import select

from app.core.celery_app import celery_app
from app.modules.documents.models import Document, DocumentPage
from app.modules.extraction.models import ExtractionJob
from app.shared.models.enums import DocumentStatus, PipelineStage
from app.shared.utils.idempotency import make_idempotency_key
from ai_pipeline.preprocessing.pipeline import preprocess_document
from workers.base_worker import execute_stage, run_async


async def _handle_preprocessing(*, session, document: Document) -> dict:
    processed = preprocess_document(document.original_filename, document.file_format)
    document.page_count = processed["page_count"]
    document.processed_s3_prefix = f"{document.org_id}/{document.id}/processed"
    document.status = DocumentStatus.OCR_PENDING
    existing_pages = {page.page_number for page in (await session.scalars(
        select(DocumentPage).where(DocumentPage.document_id == document.id)
    )).all()}
    for page in processed["pages"]:
        if page["page_number"] in existing_pages:
            continue
        session.add(
            DocumentPage(
                document_id=document.id,
                page_number=page["page_number"],
                image_quality_score=page["quality_score"],
                processed_image_s3_key=f"{document.processed_s3_prefix}/{page['processed_key_suffix']}",
                applied_skew_correction=page["skew_correction"],
                width_px=page["width_px"],
                height_px=page["height_px"],
            )
        )
    session.add(
        ExtractionJob(
            document_id=document.id,
            org_id=document.org_id,
            pipeline_stage=PipelineStage.OCR,
            idempotency_key=make_idempotency_key(document.id, PipelineStage.OCR, 1),
        )
    )
    await session.commit()
    celery_app.send_task("workers.ocr_worker.run_ocr", kwargs={"document_id": document.id})
    return {"pages": processed["page_count"], "status": document.status}


@celery_app.task(name="workers.preprocessing_worker.run_preprocessing")
def run_preprocessing(document_id: str) -> dict:
    return run_async(execute_stage(document_id=document_id, stage=PipelineStage.PREPROCESSING, handler=_handle_preprocessing))
