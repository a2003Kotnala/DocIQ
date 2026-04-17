from __future__ import annotations

from fastapi import APIRouter

router = APIRouter(prefix="/feedback", tags=["feedback"])


@router.get("/summary")
async def feedback_summary_route() -> dict:
    return {"message": "Feedback metrics are exposed through analytics endpoints."}

