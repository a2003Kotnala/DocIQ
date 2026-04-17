from __future__ import annotations

from fastapi import APIRouter, Depends
from sqlalchemy import select

from app.core.deps import CurrentUser, SessionDep
from app.modules.auth.models import Role, User
from app.modules.documents.models import DocumentType
from app.shared.utils.permissions import has_permission

router = APIRouter(prefix="/admin", tags=["admin"])


@router.get("/users")
async def users_route(session: SessionDep, user: CurrentUser) -> dict:
    if not has_permission(user.effective_permissions, "*"):
        return {"items": []}
    return {"items": (await session.scalars(select(User).where(User.org_id == user.org_id))).all()}


@router.get("/roles")
async def roles_route(session: SessionDep, user: CurrentUser) -> dict:
    return {"items": (await session.scalars(select(Role).where(Role.org_id == user.org_id))).all()}


@router.get("/document-types")
async def document_types_route(session: SessionDep, user: CurrentUser) -> dict:
    return {
        "items": (
            await session.scalars(
                select(DocumentType).where(
                    (DocumentType.org_id == user.org_id) | (DocumentType.org_id.is_(None))
                )
            )
        ).all()
    }
