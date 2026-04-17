from __future__ import annotations

from uuid import uuid4

from sqlalchemy import delete, select

from app.core.celery_app import celery_app
from app.modules.documents.models import Document, DocumentChunk, DocumentPage
from app.shared.models.enums import DocumentStatus, PipelineStage
from ai_pipeline.embedding.chunker import chunk_text
from ai_pipeline.embedding.embedder import embed_text
from ai_pipeline.embedding.vector_store import upsert_vectors
from workers.base_worker import execute_stage, run_async


async def _handle_embedding(*, session, document: Document) -> dict:
    pages = (await session.scalars(select(DocumentPage).where(DocumentPage.document_id == document.id))).all()
    text = "\n".join(page.ocr_text or "" for page in pages)
    chunks = chunk_text(text)
    await session.execute(delete(DocumentChunk).where(DocumentChunk.document_id == document.id))
    payloads = []
    for index, chunk in enumerate(chunks, start=1):
        payloads.append(
            {
                "vector": embed_text(chunk),
                "payload": {
                    "document_id": document.id,
                    "org_id": document.org_id,
                    "page_number": 1,
                    "chunk_index": index,
                    "document_type": document.document_type_id,
                    "text_preview": chunk[:200],
                },
            }
        )
    point_ids = upsert_vectors(f"org_{document.org_id}_documents", payloads) if payloads else []
    for index, (chunk, point_id) in enumerate(zip(chunks, point_ids, strict=False), start=1):
        session.add(
            DocumentChunk(
                document_id=document.id,
                org_id=document.org_id,
                qdrant_point_id=point_id,
                chunk_index=index,
                page_number=1,
                text_content=chunk,
                token_count=len(chunk.split()),
                embedding_model_version="deterministic-dev-embedding",
            )
        )
    document.status = DocumentStatus.READY
    await session.commit()
    return {"chunks": len(chunks), "status": document.status}


@celery_app.task(name="workers.embedding_worker.run_embedding")
def run_embedding(document_id: str) -> dict:
    return run_async(execute_stage(document_id=document_id, stage=PipelineStage.EMBEDDING, handler=_handle_embedding))
