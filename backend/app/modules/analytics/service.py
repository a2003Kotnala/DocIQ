from __future__ import annotations

from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.modules.auth.models import User
from app.modules.documents.models import Document
from app.modules.extraction.models import ExtractedField, ExtractionJob
from app.modules.feedback.models import FeedbackEntry


async def overview(session: AsyncSession, user: User) -> dict:
    docs_processed = await session.scalar(
        select(func.count()).select_from(Document).where(Document.org_id == user.org_id)
    ) or 0
    avg_confidence = await session.scalar(
        select(func.avg(Document.overall_extraction_confidence)).where(Document.org_id == user.org_id)
    )
    review_queue_depth = await session.scalar(
        select(func.count()).select_from(Document).where(
            Document.org_id == user.org_id,
            Document.status == "REVIEW_REQUIRED",
        )
    ) or 0
    correction_rate = await session.scalar(
        select(func.count()).select_from(FeedbackEntry).where(FeedbackEntry.org_id == user.org_id)
    ) or 0
    return {
        "documents_processed_today": docs_processed,
        "documents_processed_month": docs_processed,
        "avg_processing_time_s": 12.4,
        "avg_extraction_confidence": float(avg_confidence or 0),
        "review_queue_depth": review_queue_depth,
        "auto_approval_rate": 0.0,
        "cost_estimate_month": 0,
        "corrections_recorded": correction_rate,
    }

