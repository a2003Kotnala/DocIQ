from __future__ import annotations

from datetime import datetime, timezone

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.http import not_found
from app.modules.auth.models import User
from app.modules.documents.models import Document
from app.modules.validation.models import ValidationResult


async def override_validation(
    session: AsyncSession,
    *,
    document_id: str,
    rule_id: str,
    override_reason: str,
    user: User,
) -> ValidationResult:
    document = await session.get(Document, document_id)
    if not document or document.org_id != user.org_id:
        raise not_found("Document not found")
    result = await session.scalar(
        select(ValidationResult).where(ValidationResult.document_id == document_id, ValidationResult.rule_id == rule_id)
    )
    if not result:
        raise not_found("Validation rule not found")
    result.status = "PASSED"
    result.overridden_by = user.id
    result.override_reason = override_reason
    result.overridden_at = datetime.now(timezone.utc)
    await session.commit()
    await session.refresh(result)
    return result

