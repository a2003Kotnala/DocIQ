from __future__ import annotations

from fastapi import APIRouter, Depends

from app.core.deps import SessionDep, require_permission
from app.modules.auth.models import User
from app.modules.analytics.service import overview

router = APIRouter(prefix="/analytics", tags=["analytics"])


@router.get("/overview")
async def overview_route(
    session: SessionDep,
    user: User = Depends(require_permission("analytics.read")),
) -> dict:
    return await overview(session, user)

