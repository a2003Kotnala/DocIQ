from __future__ import annotations

from datetime import datetime

from sqlalchemy import DateTime, ForeignKey, String, Text
from sqlalchemy.orm import Mapped, mapped_column

from app.shared.models.base import Base, UUIDPrimaryKeyMixin, utc_now
from app.shared.models.types import JSON_VARIANT


class ValidationResult(UUIDPrimaryKeyMixin, Base):
    __tablename__ = "validation_results"

    document_id: Mapped[str] = mapped_column(ForeignKey("documents.id", ondelete="CASCADE"), index=True)
    extracted_field_id: Mapped[str | None] = mapped_column(ForeignKey("extracted_fields.id"), nullable=True, index=True)
    rule_id: Mapped[str] = mapped_column(String(100), index=True)
    rule_name: Mapped[str | None] = mapped_column(String(255), nullable=True)
    rule_type: Mapped[str | None] = mapped_column(String(50), nullable=True)
    status: Mapped[str] = mapped_column(String(20), index=True)
    severity: Mapped[str | None] = mapped_column(String(20), nullable=True)
    message: Mapped[str | None] = mapped_column(Text, nullable=True)
    actual_value: Mapped[dict | None] = mapped_column(JSON_VARIANT, nullable=True)
    expected_value: Mapped[dict | None] = mapped_column(JSON_VARIANT, nullable=True)
    overridden_by: Mapped[str | None] = mapped_column(ForeignKey("users.id"), nullable=True)
    override_reason: Mapped[str | None] = mapped_column(Text, nullable=True)
    overridden_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=utc_now)

