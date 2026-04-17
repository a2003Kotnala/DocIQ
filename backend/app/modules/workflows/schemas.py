from __future__ import annotations

from pydantic import BaseModel, ConfigDict, Field


class WorkflowDefinitionCreate(BaseModel):
    name: str
    description: str | None = None
    document_type_id: str | None = None
    trigger_config: dict
    conditions: list[dict] = Field(default_factory=list)
    actions: list[dict]
    sla_config: dict | None = None


class WorkflowDefinitionResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    org_id: str
    name: str
    description: str | None = None
    trigger_config: dict
    conditions: list[dict]
    actions: list[dict]
    is_active: bool

