from __future__ import annotations

from enum import StrEnum


class PlanTier(StrEnum):
    STARTER = "starter"
    PROFESSIONAL = "professional"
    ENTERPRISE = "enterprise"


class RoleName(StrEnum):
    ORG_ADMIN = "ORG_ADMIN"
    MANAGER = "MANAGER"
    ANALYST = "ANALYST"
    REVIEWER = "REVIEWER"
    VIEWER = "VIEWER"
    API_USER = "API_USER"


class DocumentStatus(StrEnum):
    PENDING = "PENDING"
    PREPROCESSING = "PREPROCESSING"
    OCR_PENDING = "OCR_PENDING"
    OCR_COMPLETE = "OCR_COMPLETE"
    LAYOUT_ANALYSIS = "LAYOUT_ANALYSIS"
    CLASSIFYING = "CLASSIFYING"
    EXTRACTION_PENDING = "EXTRACTION_PENDING"
    VALIDATION_PENDING = "VALIDATION_PENDING"
    EMBEDDING_PENDING = "EMBEDDING_PENDING"
    REVIEW_REQUIRED = "REVIEW_REQUIRED"
    APPROVED = "APPROVED"
    REJECTED = "REJECTED"
    FAILED = "FAILED"
    ARCHIVED = "ARCHIVED"
    READY = "READY"


class ValidationStatus(StrEnum):
    PASSED = "PASSED"
    PASSED_WITH_WARNINGS = "PASSED_WITH_WARNINGS"
    FAILED = "FAILED"
    REVIEW_REQUIRED = "REVIEW_REQUIRED"
    SKIPPED = "SKIPPED"


class ValidationSeverity(StrEnum):
    INFO = "INFO"
    WARNING = "WARNING"
    ERROR = "ERROR"


class ExtractionMethod(StrEnum):
    RULE = "rule"
    LLM = "llm"
    HYBRID = "hybrid"


class JobStatus(StrEnum):
    PENDING = "PENDING"
    RUNNING = "RUNNING"
    COMPLETE = "COMPLETE"
    FAILED = "FAILED"
    RETRYING = "RETRYING"


class PipelineStage(StrEnum):
    PREPROCESSING = "preprocessing"
    OCR = "ocr"
    LAYOUT = "layout"
    CLASSIFICATION = "classification"
    EXTRACTION = "extraction"
    VALIDATION = "validation"
    EMBEDDING = "embedding"
    WORKFLOW = "workflow"


class AccessLevel(StrEnum):
    ORG = "ORG"
    RESTRICTED = "RESTRICTED"
    CONFIDENTIAL = "CONFIDENTIAL"


class FeedbackType(StrEnum):
    FIELD_CORRECTION = "field_correction"
    CLASSIFICATION = "classification"
    QA_QUALITY = "qa_quality"
    EXTRACTION_MISSING = "extraction_missing"
    FALSE_POSITIVE = "false_positive"
    SEARCH_RELEVANCE = "search_relevance"


class QueryType(StrEnum):
    SEMANTIC_SEARCH = "semantic_search"
    QA = "qa"


class WorkflowRunStatus(StrEnum):
    RUNNING = "RUNNING"
    COMPLETED = "COMPLETED"
    FAILED = "FAILED"
    CANCELLED = "CANCELLED"


class WorkflowActionStatus(StrEnum):
    PENDING = "PENDING"
    RUNNING = "RUNNING"
    SUCCESS = "SUCCESS"
    FAILED = "FAILED"
    RETRYING = "RETRYING"
    DEAD = "DEAD"


class ApprovalStatus(StrEnum):
    PENDING = "PENDING"
    APPROVED = "APPROVED"
    REJECTED = "REJECTED"
    ESCALATED = "ESCALATED"

