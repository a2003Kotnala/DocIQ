from __future__ import annotations

from fastapi import APIRouter, Depends

from app.core.deps import CurrentUser, SessionDep, require_permission
from app.modules.analytics.service import overview

router = APIRouter(prefix="/analytics", tags=["analytics"])


@router.get("/overview")
async def overview_route(
    session: SessionDep,
    user: CurrentUser = Depends(require_permission("analytics.read")),
) -> dict:
    return await overview(session, user)

