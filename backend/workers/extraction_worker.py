from __future__ import annotations

from sqlalchemy import delete, select

from app.core.celery_app import celery_app
from app.modules.documents.models import Document, DocumentPage, DocumentType
from app.modules.extraction.models import ExtractedField, ExtractionJob
from app.shared.models.enums import DocumentStatus, PipelineStage
from app.shared.utils.idempotency import make_idempotency_key
from ai_pipeline.extraction.llm_extractor import run_llm_extraction
from ai_pipeline.extraction.result_merger import merge_results
from ai_pipeline.extraction.rule_engine.engine import run_rule_extraction
from workers.base_worker import execute_stage, run_async


async def _handle_extraction(*, session, document: Document) -> dict:
    doc_type = None
    if document.document_type_id:
        doc_type = await session.get(DocumentType, document.document_type_id)
    if not doc_type:
        doc_type = await session.scalar(select(DocumentType).where(DocumentType.name == "invoice"))
    pages = (await session.scalars(select(DocumentPage).where(DocumentPage.document_id == document.id))).all()
    text = "\n".join(page.ocr_text or "" for page in pages)
    schema = doc_type.extraction_schema if doc_type else {"fields": []}
    rule_results = run_rule_extraction(text, schema)
    llm_results = run_llm_extraction(text, schema)
    merged = merge_results(rule_results, llm_results)
    await session.execute(delete(ExtractedField).where(ExtractedField.document_id == document.id))
    for result in merged:
        session.add(
            ExtractedField(
                document_id=document.id,
                org_id=document.org_id,
                field_name=result["field_name"],
                field_display_name=result["field_name"].replace("_", " ").title(),
                raw_value=result["value"],
                normalized_value={"value": result["value"]},
                data_type="string",
                source_page_number=1,
                source_bbox=result.get("bbox"),
                source_text=result.get("source_text"),
                extraction_method=result.get("method"),
                confidence=result["confidence"],
                extraction_confidence=result["confidence"],
                candidate_values=result.get("candidate_values", []),
            )
        )
    document.overall_extraction_confidence = (
        round(sum(item["confidence"] for item in merged) / len(merged), 4) if merged else 0
    )
    document.status = DocumentStatus.VALIDATION_PENDING
    session.add(
        ExtractionJob(
            document_id=document.id,
            org_id=document.org_id,
            pipeline_stage=PipelineStage.VALIDATION,
            idempotency_key=make_idempotency_key(document.id, PipelineStage.VALIDATION, 1),
        )
    )
    await session.commit()
    celery_app.send_task("workers.validation_worker.run_validation", kwargs={"document_id": document.id})
    return {"fields": len(merged), "confidence": document.overall_extraction_confidence}


@celery_app.task(name="workers.extraction_worker.run_extraction")
def run_extraction(document_id: str) -> dict:
    return run_async(execute_stage(document_id=document_id, stage=PipelineStage.EXTRACTION, handler=_handle_extraction))
