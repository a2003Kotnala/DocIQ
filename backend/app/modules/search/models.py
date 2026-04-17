from __future__ import annotations

from datetime import datetime

from sqlalchemy import DateTime, ForeignKey, Integer, String, Text
from sqlalchemy.orm import Mapped, mapped_column

from app.shared.models.base import Base, UUIDPrimaryKeyMixin, utc_now
from app.shared.models.types import JSON_VARIANT


class SearchQuery(UUIDPrimaryKeyMixin, Base):
    __tablename__ = "search_queries"

    org_id: Mapped[str] = mapped_column(index=True)
    user_id: Mapped[str | None] = mapped_column(ForeignKey("users.id"), nullable=True)
    query_text: Mapped[str] = mapped_column(Text)
    query_type: Mapped[str | None] = mapped_column(String(20), nullable=True)
    filters_applied: Mapped[dict | None] = mapped_column(JSON_VARIANT, nullable=True)
    results_count: Mapped[int | None] = mapped_column(Integer, nullable=True)
    chunks_retrieved: Mapped[list[dict] | None] = mapped_column(JSON_VARIANT, nullable=True)
    llm_answer: Mapped[str | None] = mapped_column(Text, nullable=True)
    citations: Mapped[list[dict] | None] = mapped_column(JSON_VARIANT, nullable=True)
    answer_confidence: Mapped[str | None] = mapped_column(String(20), nullable=True)
    latency_ms: Mapped[int | None] = mapped_column(Integer, nullable=True)
    user_rating: Mapped[int | None] = mapped_column(Integer, nullable=True)
    user_feedback_text: Mapped[str | None] = mapped_column(Text, nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=utc_now)

