from __future__ import annotations

import time

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.llm import generate_text
from app.modules.auth.models import User
from app.modules.documents.models import Document, DocumentChunk
from app.modules.search.models import SearchQuery
from app.modules.search.schemas import AskRequest, SearchFeedbackRequest, SearchRequest


async def run_search(session: AsyncSession, payload: SearchRequest, user: User) -> dict:
    started = time.perf_counter()
    query = (
        select(DocumentChunk, Document)
        .join(Document, Document.id == DocumentChunk.document_id)
        .where(Document.org_id == user.org_id)
        .where(DocumentChunk.text_content.ilike(f"%{payload.query}%"))
    )
    if payload.filters.document_ids:
        query = query.where(Document.id.in_(payload.filters.document_ids))
    if payload.filters.document_type_id:
        query = query.where(Document.document_type_id == payload.filters.document_type_id)
    if payload.filters.validation_status:
        query = query.where(Document.validation_status == payload.filters.validation_status)

    matches = (await session.execute(query.limit(payload.page_size))).all()
    latency_ms = int((time.perf_counter() - started) * 1000)
    results = [
        {
            "chunk_text": chunk.text_content,
            "document_id": str(document.id),
            "document_name": document.original_filename,
            "page_number": chunk.page_number,
            "relevance_score": 1.0,
            "highlighted_text": chunk.text_content[:240],
            "matched_fields": [],
        }
        for chunk, document in matches
    ]
    record = SearchQuery(
        org_id=user.org_id,
        user_id=user.id,
        query_text=payload.query,
        query_type="semantic_search",
        filters_applied=payload.filters.model_dump(),
        results_count=len(results),
        chunks_retrieved=[
            {"chunk_id": str(chunk.id), "document_id": str(document.id), "score": 1.0}
            for chunk, document in matches
        ],
        latency_ms=latency_ms,
    )
    session.add(record)
    await session.commit()
    await session.refresh(record)
    return {
        "results": results,
        "total_estimated": len(results),
        "latency_ms": latency_ms,
        "search_query_id": str(record.id),
    }


async def ask_question(session: AsyncSession, payload: AskRequest, user: User) -> dict:
    search_result = await run_search(
        session,
        SearchRequest(query=payload.question, filters=payload.filters, page=1, page_size=5),
        user,
    )
    results = search_result["results"]

    if not results:
        answer = "I don't have enough information in the provided documents to answer that question."
        confidence = "low"
        citations: list[dict] = []
    else:
        # Build context from top results
        context_parts = []
        for i, res in enumerate(results[:4], 1):
            context_parts.append(
                f"[Source {i}: {res['document_name']}, page {res['page_number']}]\n"
                f"{res['chunk_text'][:400]}"
            )
        context = "\n\n".join(context_parts)

        system_prompt = (
            "You are DocIQ, an enterprise document intelligence assistant. "
            "Answer questions strictly based on the provided document excerpts. "
            "Be concise, factual, and cite the source document name and page number. "
            "If the answer is not in the sources, say so clearly."
        )
        user_prompt = (
            f"Question: {payload.question}\n\n"
            f"Document excerpts:\n{context}\n\n"
            "Provide a concise, evidence-backed answer. Mention which document(s) and "
            "page number(s) your answer comes from."
        )

        try:
            answer = await generate_text(user_prompt, system=system_prompt)
            confidence = "high" if len(results) >= 3 else "medium"
        except Exception as exc:  # noqa: BLE001
            # Graceful degradation: fall back to deterministic answer
            first = results[0]
            answer = (
                f"Based on {first['document_name']} (page {first['page_number']}), "
                f"the most relevant evidence is: {first['chunk_text'][:280]}"
            )
            confidence = "medium"
            _ = exc  # logged upstream by llm module

        citations = [
            {
                "document_id": res["document_id"],
                "document_name": res["document_name"],
                "page_number": res["page_number"],
                "excerpt": res["chunk_text"][:200],
            }
            for res in results[:4]
        ]

    record = await session.get(SearchQuery, search_result["search_query_id"])
    if record:
        record.query_type = "qa"
        record.llm_answer = answer
        record.citations = citations
        record.answer_confidence = confidence
        await session.commit()

    return {
        "answer": answer,
        "confidence": confidence,
        "citations": citations,
        "latency_ms": search_result["latency_ms"],
    }


async def submit_search_feedback(session: AsyncSession, payload: SearchFeedbackRequest) -> None:
    record = await session.get(SearchQuery, payload.search_query_id)
    if record:
        record.user_rating = payload.rating
        record.user_feedback_text = payload.reason or payload.preferred_answer
        await session.commit()
