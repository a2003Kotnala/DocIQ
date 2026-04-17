from __future__ import annotations

from datetime import datetime

from sqlalchemy import Boolean, DateTime, ForeignKey, String
from sqlalchemy.orm import Mapped, mapped_column

from app.shared.models.base import Base, UUIDPrimaryKeyMixin, utc_now
from app.shared.models.types import JSON_VARIANT


class ModelVersion(UUIDPrimaryKeyMixin, Base):
    __tablename__ = "model_versions"

    model_type: Mapped[str] = mapped_column(String(50), index=True)
    model_name: Mapped[str] = mapped_column(String(255))
    version_tag: Mapped[str] = mapped_column(String(100), index=True)
    artifact_s3_path: Mapped[str | None] = mapped_column(String(1000), nullable=True)
    model_card: Mapped[dict | None] = mapped_column(JSON_VARIANT, nullable=True)
    evaluation_metrics: Mapped[dict | None] = mapped_column(JSON_VARIANT, nullable=True)
    evaluation_dataset_version: Mapped[str | None] = mapped_column(String(100), nullable=True)
    is_current: Mapped[bool] = mapped_column(Boolean, default=False)
    deployed_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)
    deployed_by: Mapped[str | None] = mapped_column(ForeignKey("users.id"), nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=utc_now)

