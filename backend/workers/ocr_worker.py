from __future__ import annotations

from sqlalchemy import select

from app.core.celery_app import celery_app
from app.modules.documents.models import Document, DocumentPage, OCRSample
from app.modules.extraction.models import ExtractionJob
from app.shared.models.enums import DocumentStatus, PipelineStage
from app.shared.utils.idempotency import make_idempotency_key
from ai_pipeline.ocr.confidence_calibrator import calibrate_confidence
from ai_pipeline.ocr.paddle_ocr_runner import run_paddle_ocr
from workers.base_worker import execute_stage, run_async


async def _handle_ocr(*, session, document: Document) -> dict:
    pages = (await session.scalars(select(DocumentPage).where(DocumentPage.document_id == document.id))).all()
    confidences = []
    for page in pages:
        payload = run_paddle_ocr(document.original_filename)
        confidence = calibrate_confidence(payload["page_confidence"])
        page.ocr_confidence = confidence
        page.ocr_text = "\n".join(item["text"] for item in payload["lines"])
        page.ocr_status = "COMPLETE"
        confidences.append(confidence)
        existing = await session.scalar(select(OCRSample).where(OCRSample.page_id == page.id))
        if not existing:
            session.add(
                OCRSample(
                    document_id=document.id,
                    page_id=page.id,
                    payload=payload,
                    page_confidence=confidence,
                )
            )
    document.overall_ocr_confidence = round(sum(confidences) / len(confidences), 4) if confidences else 0
    document.status = DocumentStatus.LAYOUT_ANALYSIS
    session.add(
        ExtractionJob(
            document_id=document.id,
            org_id=document.org_id,
            pipeline_stage=PipelineStage.LAYOUT,
            idempotency_key=make_idempotency_key(document.id, PipelineStage.LAYOUT, 1),
        )
    )
    session.add(
        ExtractionJob(
            document_id=document.id,
            org_id=document.org_id,
            pipeline_stage=PipelineStage.CLASSIFICATION,
            idempotency_key=make_idempotency_key(document.id, PipelineStage.CLASSIFICATION, 1),
        )
    )
    await session.commit()
    celery_app.send_task("workers.layout_worker.run_layout", kwargs={"document_id": document.id})
    celery_app.send_task("workers.classification_worker.run_classification", kwargs={"document_id": document.id})
    return {"pages": len(pages), "ocr_confidence": document.overall_ocr_confidence}


@celery_app.task(name="workers.ocr_worker.run_ocr")
def run_ocr(document_id: str) -> dict:
    return run_async(execute_stage(document_id=document_id, stage=PipelineStage.OCR, handler=_handle_ocr))

