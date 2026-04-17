from __future__ import annotations

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.modules.auth.models import User
from app.modules.documents.models import Document
from app.modules.workflows.models import WorkflowActionRun, WorkflowDefinition, WorkflowRun
from app.modules.workflows.schemas import WorkflowDefinitionCreate


async def list_workflows(session: AsyncSession, user: User) -> list[WorkflowDefinition]:
    return (
        await session.scalars(select(WorkflowDefinition).where(WorkflowDefinition.org_id == user.org_id))
    ).all()


async def create_workflow(session: AsyncSession, payload: WorkflowDefinitionCreate, user: User) -> WorkflowDefinition:
    workflow = WorkflowDefinition(org_id=user.org_id, created_by=user.id, **payload.model_dump())
    session.add(workflow)
    await session.commit()
    await session.refresh(workflow)
    return workflow


async def list_workflow_runs(session: AsyncSession, workflow_id: str, user: User) -> list[WorkflowRun]:
    return (
        await session.scalars(
            select(WorkflowRun)
            .join(WorkflowDefinition, WorkflowDefinition.id == WorkflowRun.workflow_definition_id)
            .where(WorkflowDefinition.id == workflow_id, WorkflowDefinition.org_id == user.org_id)
        )
    ).all()


async def trigger_document_workflows(session: AsyncSession, document_id: str) -> list[WorkflowRun]:
    document = await session.get(Document, document_id)
    if not document:
        return []
    definitions = (
        await session.scalars(
            select(WorkflowDefinition).where(
                WorkflowDefinition.org_id == document.org_id,
                WorkflowDefinition.is_active.is_(True),
            )
        )
    ).all()
    runs: list[WorkflowRun] = []
    for definition in definitions:
        run = WorkflowRun(
            workflow_definition_id=definition.id,
            document_id=document.id,
            org_id=document.org_id,
            trigger_details={"source": "document_status", "status": document.status},
        )
        session.add(run)
        await session.flush()
        for index, action in enumerate(definition.actions, start=1):
            session.add(
                WorkflowActionRun(
                    workflow_run_id=run.id,
                    step_number=index,
                    action_type=action["type"],
                    request_payload=action,
                    status="PENDING",
                )
            )
        runs.append(run)
    await session.commit()
    return runs

