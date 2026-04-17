from __future__ import annotations

from fastapi import APIRouter, Depends

from app.core.deps import CurrentUser, SessionDep, require_permission
from app.modules.auth.models import User
from app.modules.search.schemas import AskRequest, SearchFeedbackRequest, SearchRequest
from app.modules.search.service import ask_question, run_search, submit_search_feedback

router = APIRouter(prefix="/search", tags=["search"])
qa_router = APIRouter(prefix="/qa", tags=["qa"])


@router.post("")
async def search_route(
    payload: SearchRequest,
    session: SessionDep,
    user: User = Depends(require_permission("search.execute")),
) -> dict:
    return await run_search(session, payload, user)


@router.get("/history")
async def search_history_route(session: SessionDep, user: CurrentUser) -> dict:
    return {"message": "Search history is available from search_queries records."}


@qa_router.post("/ask")
async def ask_route(
    payload: AskRequest,
    session: SessionDep,
    user: User = Depends(require_permission("search.execute")),
) -> dict:
    return await ask_question(session, payload, user)


@qa_router.post("/feedback")
async def qa_feedback_route(payload: SearchFeedbackRequest, session: SessionDep) -> dict:
    await submit_search_feedback(session, payload)
    return {"status": "ok"}

