from __future__ import annotations

from sqlalchemy import select

from app.core.celery_app import celery_app
from app.modules.documents.models import Document, DocumentPage, LayoutElement
from app.shared.models.enums import DocumentStatus, PipelineStage
from ai_pipeline.layout.layout_detector import detect_layout
from workers.base_worker import execute_stage, run_async


async def _handle_layout(*, session, document: Document) -> dict:
    pages = (await session.scalars(select(DocumentPage).where(DocumentPage.document_id == document.id))).all()
    count = 0
    for page in pages:
        for element in detect_layout(page.ocr_text or ""):
            session.add(
                LayoutElement(
                    document_id=document.id,
                    page_id=page.id,
                    element_type=element["element_type"],
                    bbox=element.get("bbox", {}),
                    text_content=element.get("text"),
                    table_data=element.get("table_data"),
                    confidence=element.get("confidence"),
                    reading_order=element.get("reading_order"),
                )
            )
            count += 1
    document.status = DocumentStatus.CLASSIFYING
    await session.commit()
    return {"layout_elements": count}


@celery_app.task(name="workers.layout_worker.run_layout")
def run_layout(document_id: str) -> dict:
    return run_async(execute_stage(document_id=document_id, stage=PipelineStage.LAYOUT, handler=_handle_layout))

