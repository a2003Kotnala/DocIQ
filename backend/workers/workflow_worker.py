from __future__ import annotations

from app.core.celery_app import celery_app
from app.modules.workflows.service import trigger_document_workflows
from workers.base_worker import run_async
from app.core.db import AsyncSessionLocal


async def _run(document_id: str) -> dict:
    async with AsyncSessionLocal() as session:
        runs = await trigger_document_workflows(session, document_id)
        return {"runs": len(runs)}


@celery_app.task(name="workers.workflow_worker.run_workflows")
def run_workflows(document_id: str) -> dict:
    return run_async(_run(document_id))

