from __future__ import annotations

from datetime import datetime

from sqlalchemy import DateTime, Float, ForeignKey, String, Text
from sqlalchemy.orm import Mapped, mapped_column

from app.shared.models.base import Base, UUIDPrimaryKeyMixin, utc_now
from app.shared.models.types import JSON_VARIANT


class FeedbackEntry(UUIDPrimaryKeyMixin, Base):
    __tablename__ = "feedback_entries"

    org_id: Mapped[str] = mapped_column(ForeignKey("organizations.id"), index=True)
    user_id: Mapped[str] = mapped_column(ForeignKey("users.id"), index=True)
    feedback_type: Mapped[str] = mapped_column(String(50), index=True)
    document_id: Mapped[str | None] = mapped_column(ForeignKey("documents.id"), nullable=True, index=True)
    extracted_field_id: Mapped[str | None] = mapped_column(ForeignKey("extracted_fields.id"), nullable=True)
    search_query_id: Mapped[str | None] = mapped_column(ForeignKey("search_queries.id"), nullable=True)
    original_value: Mapped[dict | None] = mapped_column(JSON_VARIANT, nullable=True)
    corrected_value: Mapped[dict | None] = mapped_column(JSON_VARIANT, nullable=True)
    correction_reason: Mapped[str | None] = mapped_column(String(255), nullable=True)
    model_version_id: Mapped[str | None] = mapped_column(ForeignKey("model_versions.id"), nullable=True)
    pipeline_run_id: Mapped[str | None] = mapped_column(ForeignKey("extraction_jobs.id"), nullable=True)
    confidence_at_extraction: Mapped[float | None] = mapped_column(Float, nullable=True)
    review_status: Mapped[str] = mapped_column(String(20), default="PENDING")
    priority_score: Mapped[float | None] = mapped_column(Float, nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=utc_now)

