from __future__ import annotations

from fastapi import APIRouter, Depends

from app.core.deps import SessionDep, require_permission
from app.modules.auth.models import User
from app.modules.workflows.schemas import WorkflowDefinitionCreate
from app.modules.workflows.service import create_workflow, list_workflow_runs, list_workflows

router = APIRouter(prefix="/workflows", tags=["workflows"])


@router.get("")
async def list_workflows_route(
    session: SessionDep,
    user: User = Depends(require_permission("workflow.read")),
) -> dict:
    return {"items": await list_workflows(session, user)}


@router.post("")
async def create_workflow_route(
    payload: WorkflowDefinitionCreate,
    session: SessionDep,
    user: User = Depends(require_permission("workflow.manage")),
) -> dict:
    workflow = await create_workflow(session, payload, user)
    return {"workflow": workflow}


@router.get("/{workflow_id}/runs")
async def workflow_runs_route(
    workflow_id: str,
    session: SessionDep,
    user: User = Depends(require_permission("workflow.read")),
) -> dict:
    return {"items": await list_workflow_runs(session, workflow_id, user)}

