from __future__ import annotations

from datetime import datetime

from sqlalchemy import DateTime, ForeignKey, Index, Integer, String, Text
from sqlalchemy.orm import Mapped, mapped_column

from app.shared.models.base import Base, TimestampMixin, UUIDPrimaryKeyMixin, utc_now
from app.shared.models.types import JSON_VARIANT


class WorkflowDefinition(UUIDPrimaryKeyMixin, TimestampMixin, Base):
    __tablename__ = "workflow_definitions"

    org_id: Mapped[str] = mapped_column(index=True)
    name: Mapped[str] = mapped_column(String(255))
    description: Mapped[str | None] = mapped_column(Text, nullable=True)
    document_type_id: Mapped[str | None] = mapped_column(ForeignKey("document_types.id"), nullable=True)
    trigger_config: Mapped[dict] = mapped_column(JSON_VARIANT, default=dict)
    conditions: Mapped[list[dict]] = mapped_column(JSON_VARIANT, default=list)
    actions: Mapped[list[dict]] = mapped_column(JSON_VARIANT, default=list)
    sla_config: Mapped[dict | None] = mapped_column(JSON_VARIANT, nullable=True)
    is_active: Mapped[bool] = mapped_column(default=True)
    created_by: Mapped[str | None] = mapped_column(ForeignKey("users.id"), nullable=True)


class WorkflowRun(UUIDPrimaryKeyMixin, Base):
    __tablename__ = "workflow_runs"
    __table_args__ = (Index("ix_workflow_runs_org_status", "org_id", "status"),)

    workflow_definition_id: Mapped[str] = mapped_column(ForeignKey("workflow_definitions.id"), index=True)
    document_id: Mapped[str] = mapped_column(ForeignKey("documents.id"), index=True)
    org_id: Mapped[str] = mapped_column(index=True)
    status: Mapped[str] = mapped_column(String(30), default="RUNNING")
    triggered_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=utc_now)
    completed_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)
    current_step: Mapped[int] = mapped_column(Integer, default=0)
    trigger_details: Mapped[dict | None] = mapped_column(JSON_VARIANT, nullable=True)
    result_summary: Mapped[dict | None] = mapped_column(JSON_VARIANT, nullable=True)


class WorkflowActionRun(UUIDPrimaryKeyMixin, Base):
    __tablename__ = "workflow_action_runs"

    workflow_run_id: Mapped[str] = mapped_column(ForeignKey("workflow_runs.id", ondelete="CASCADE"), index=True)
    step_number: Mapped[int] = mapped_column(Integer)
    action_type: Mapped[str] = mapped_column(String(50))
    status: Mapped[str] = mapped_column(String(20), default="PENDING")
    attempt_number: Mapped[int] = mapped_column(Integer, default=1)
    idempotency_key: Mapped[str | None] = mapped_column(String(255), nullable=True)
    request_payload: Mapped[dict | None] = mapped_column(JSON_VARIANT, nullable=True)
    response_payload: Mapped[dict | None] = mapped_column(JSON_VARIANT, nullable=True)
    error_message: Mapped[str | None] = mapped_column(Text, nullable=True)
    started_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)
    completed_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)


class ApprovalTask(UUIDPrimaryKeyMixin, Base):
    __tablename__ = "approval_tasks"
    __table_args__ = (Index("ix_approval_tasks_org_status", "org_id", "status"),)

    org_id: Mapped[str] = mapped_column(index=True)
    document_id: Mapped[str] = mapped_column(ForeignKey("documents.id", ondelete="CASCADE"), index=True)
    workflow_run_id: Mapped[str | None] = mapped_column(ForeignKey("workflow_runs.id"), nullable=True)
    assignee_user_id: Mapped[str | None] = mapped_column(ForeignKey("users.id"), nullable=True)
    assignee_role: Mapped[str | None] = mapped_column(String(100), nullable=True)
    status: Mapped[str] = mapped_column(String(20), default="PENDING")
    priority: Mapped[str] = mapped_column(String(20), default="MEDIUM")
    comments: Mapped[str | None] = mapped_column(Text, nullable=True)
    due_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)
    resolved_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=utc_now)

