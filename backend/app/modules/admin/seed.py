from __future__ import annotations

import json
from pathlib import Path

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.modules.auth.models import Organization, User, UserRole
from app.modules.auth.service import ensure_system_roles
from app.core.security import hash_password
from app.shared.models.enums import RoleName
from app.modules.documents.models import DocumentType
from app.modules.workflows.models import WorkflowDefinition


async def seed_platform_data(
    *,
    session: AsyncSession,
    schemas_dir: Path,
    rules_dir: Path,
    workflows_dir: Path,
) -> None:
    admin_org_id = "seed-org"
    if not await session.get(Organization, admin_org_id):
        session.add(
            Organization(
                id=admin_org_id,
                name="Seed Organization",
                slug="seed-org",
                plan_tier="enterprise",
            )
        )
        await session.flush()
    roles = await ensure_system_roles(session, org_id=admin_org_id)

    admin_user = await session.scalar(select(User).where(User.org_id == admin_org_id, User.email == "admin@dociq.test"))
    if not admin_user:
        admin_user = User(
            org_id=admin_org_id,
            email="admin@dociq.test",
            hashed_password=hash_password("password123"),
            display_name="DocIQ Admin",
        )
        session.add(admin_user)
        await session.flush()
        admin_role = next(role for role in roles if role.name == RoleName.ORG_ADMIN)
        session.add(UserRole(user_id=admin_user.id, role_id=admin_role.id, assigned_by=admin_user.id))

    for schema_path in schemas_dir.glob("*.json"):
        payload = json.loads(schema_path.read_text(encoding="utf-8"))
        existing = await session.scalar(
            select(DocumentType).where(DocumentType.org_id.is_(None), DocumentType.name == payload["name"])
        )
        if existing:
            continue
        rule_path = rules_dir / f"{payload['name']}.json"
        validation_schema = json.loads(rule_path.read_text(encoding="utf-8")) if rule_path.exists() else {}
        session.add(
            DocumentType(
                org_id=None,
                name=payload["name"],
                display_name=payload["display_name"],
                extraction_schema=payload,
                validation_schema=validation_schema,
                classification_keywords=[field["name"] for field in payload.get("fields", [])],
            )
        )

    for workflow_path in workflows_dir.glob("*.json"):
        payload = json.loads(workflow_path.read_text(encoding="utf-8"))
        existing = await session.scalar(
            select(WorkflowDefinition).where(WorkflowDefinition.org_id == admin_org_id, WorkflowDefinition.name == payload["name"])
        )
        if existing:
            continue
        session.add(
            WorkflowDefinition(
                org_id=admin_org_id,
                name=payload["name"],
                description=payload.get("name"),
                trigger_config=payload["trigger"],
                conditions=payload.get("conditions", []),
                actions=payload.get("actions", []),
                sla_config=payload.get("sla_escalation"),
                is_active=True,
            )
        )
    await session.commit()
