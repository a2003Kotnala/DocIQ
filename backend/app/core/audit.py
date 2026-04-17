from __future__ import annotations

from sqlalchemy.ext.asyncio import AsyncSession

from app.shared.models.audit import AuditLog


async def write_audit_log(
    session: AsyncSession,
    *,
    org_id: str,
    action: str,
    user_id: str | None = None,
    resource_type: str | None = None,
    resource_id: str | None = None,
    before_state: dict | None = None,
    after_state: dict | None = None,
    ip_address: str | None = None,
    user_agent: str | None = None,
) -> AuditLog:
    record = AuditLog(
        org_id=org_id,
        user_id=user_id,
        action=action,
        resource_type=resource_type,
        resource_id=resource_id,
        before_state=before_state,
        after_state=after_state,
        ip_address=ip_address,
        user_agent=user_agent,
    )
    session.add(record)
    await session.flush()
    return record

