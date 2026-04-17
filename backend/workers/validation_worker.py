from __future__ import annotations

from sqlalchemy import delete, select

from app.core.celery_app import celery_app
from app.modules.documents.models import Document, DocumentType
from app.modules.documents.models import DocumentChunk
from app.modules.extraction.models import ExtractedField, ExtractionJob
from app.modules.validation.anomaly_detector import detect_anomalies
from app.modules.validation.models import ValidationResult
from app.modules.validation.rule_evaluator import evaluate_rule
from app.shared.models.enums import DocumentStatus, PipelineStage, ValidationSeverity, ValidationStatus
from app.shared.utils.idempotency import make_idempotency_key
from workers.base_worker import execute_stage, run_async


async def _handle_validation(*, session, document: Document) -> dict:
    doc_type = await session.get(DocumentType, document.document_type_id) if document.document_type_id else None
    fields = (
        await session.scalars(select(ExtractedField).where(ExtractedField.document_id == document.id))
    ).all()
    field_map = {field.field_name: field.normalized_value or {"value": field.raw_value} for field in fields}
    rules = (doc_type.validation_schema if doc_type else {}).get("rules", [])
    await session.execute(delete(ValidationResult).where(ValidationResult.document_id == document.id))
    failures = 0
    for rule in rules:
        status, message = evaluate_rule(rule, field_map)
        if status == "FAILED":
            failures += 1
        session.add(
            ValidationResult(
                document_id=document.id,
                rule_id=rule["rule_id"],
                rule_name=rule.get("message"),
                rule_type=rule.get("rule_type"),
                status=status,
                severity=rule.get("severity", ValidationSeverity.ERROR),
                message=message,
                actual_value=field_map,
            )
        )
    for anomaly in detect_anomalies(field_map):
        session.add(
            ValidationResult(
                document_id=document.id,
                rule_id=anomaly["type"],
                rule_name=anomaly["message"],
                rule_type="anomaly",
                status="WARNING",
                severity=ValidationSeverity.WARNING,
                message=anomaly["message"],
                actual_value=field_map,
            )
        )
    document.validation_status = ValidationStatus.FAILED if failures else ValidationStatus.PASSED
    document.status = DocumentStatus.REVIEW_REQUIRED if failures else DocumentStatus.EMBEDDING_PENDING
    if document.status == DocumentStatus.EMBEDDING_PENDING:
        session.add(
            ExtractionJob(
                document_id=document.id,
                org_id=document.org_id,
                pipeline_stage=PipelineStage.EMBEDDING,
                idempotency_key=make_idempotency_key(document.id, PipelineStage.EMBEDDING, 1),
            )
        )
    await session.commit()
    if document.status == DocumentStatus.EMBEDDING_PENDING:
        celery_app.send_task("workers.embedding_worker.run_embedding", kwargs={"document_id": document.id})
    return {"failures": failures, "status": document.validation_status}


@celery_app.task(name="workers.validation_worker.run_validation")
def run_validation(document_id: str) -> dict:
    return run_async(execute_stage(document_id=document_id, stage=PipelineStage.VALIDATION, handler=_handle_validation))

