from __future__ import annotations

from fastapi import APIRouter, Depends
from pydantic import BaseModel

from app.core.deps import CurrentUser, SessionDep, require_permission
from app.modules.validation.service import override_validation

router = APIRouter(prefix="/validation", tags=["validation"])


class OverrideRequest(BaseModel):
    document_id: str
    rule_id: str
    override_reason: str


@router.post("/override")
async def override_validation_route(
    payload: OverrideRequest,
    session: SessionDep,
    user: CurrentUser = Depends(require_permission("document.approve")),
) -> dict:
    result = await override_validation(
        session,
        document_id=payload.document_id,
        rule_id=payload.rule_id,
        override_reason=payload.override_reason,
        user=user,
    )
    return {"result": result}

