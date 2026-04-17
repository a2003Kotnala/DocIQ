from __future__ import annotations

import asyncio
import traceback
from datetime import datetime, timezone
from typing import Any, Awaitable, Callable

from sqlalchemy import select

from app.core.db import AsyncSessionLocal
from app.modules.documents.models import Document
from app.modules.extraction.models import ExtractionJob


async def execute_stage(
    *,
    document_id: str,
    stage: str,
    handler: Callable[..., Awaitable[dict[str, Any]]],
) -> dict[str, Any]:
    async with AsyncSessionLocal() as session:
        document = await session.get(Document, document_id)
        if not document:
            return {"status": "missing"}
        job = await session.scalar(
            select(ExtractionJob)
            .where(ExtractionJob.document_id == document_id, ExtractionJob.pipeline_stage == stage)
            .order_by(ExtractionJob.queued_at.desc())
        )
        if job:
            if job.status == "COMPLETE":
                return job.result_summary or {"status": "already_complete"}
            job.status = "RUNNING"
            job.started_at = datetime.now(timezone.utc)
            await session.commit()
        try:
            result = await handler(session=session, document=document)
            if job:
                job.status = "COMPLETE"
                job.completed_at = datetime.now(timezone.utc)
                job.result_summary = result
                if job.started_at:
                    job.duration_ms = int((job.completed_at - job.started_at).total_seconds() * 1000)
                await session.commit()
            return result
        except Exception as exc:
            if job:
                job.status = "FAILED"
                job.completed_at = datetime.now(timezone.utc)
                job.error_message = str(exc)
                job.error_traceback = traceback.format_exc()
            document.status = "FAILED"
            await session.commit()
            raise


def run_async(coro: Awaitable[dict[str, Any]]) -> dict[str, Any]:
    return asyncio.run(coro)
