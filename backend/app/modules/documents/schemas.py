from __future__ import annotations

from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field


class UploadUrlRequest(BaseModel):
    filename: str
    file_size_bytes: int = Field(gt=0)
    file_format: str
    document_type_id: str | None = None
    tags: list[str] = Field(default_factory=list)
    custom_metadata: dict = Field(default_factory=dict)


class UploadUrlResponse(BaseModel):
    document_id: str
    upload_url: str
    object_key: str
    expires_in_seconds: int = 900


class DocumentSummary(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    org_id: str
    original_filename: str
    file_format: str
    status: str
    validation_status: str | None = None
    overall_extraction_confidence: float | None = None
    created_at: datetime


class BoundingBox(BaseModel):
    page: int | None = None
    x: float | None = None
    y: float | None = None
    width: float | None = None
    height: float | None = None


class ExtractedFieldResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    field_name: str
    field_display_name: str | None = None
    raw_value: str | None = None
    normalized_value: dict | None = None
    confidence: float
    extraction_method: str | None = None
    source_page_number: int | None = None
    source_bbox: dict | None = None
    source_text: str | None = None
    is_reviewed: bool
    is_corrected: bool


class ValidationResultResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    rule_id: str
    status: str
    severity: str | None = None
    message: str | None = None


class DocumentDetail(DocumentSummary):
    page_count: int | None = None
    classification_confidence: float | None = None
    tags: list[str] = Field(default_factory=list)
    extracted_fields: list[ExtractedFieldResponse] = Field(default_factory=list)
    validation_results: list[ValidationResultResponse] = Field(default_factory=list)


class CorrectFieldRequest(BaseModel):
    corrected_value: str
    correction_reason: str | None = None


class ApproveDocumentRequest(BaseModel):
    comments: str | None = None


class RejectDocumentRequest(BaseModel):
    reason: str

