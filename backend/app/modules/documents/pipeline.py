from __future__ import annotations

from pathlib import Path

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.db import AsyncSessionLocal
from app.modules.documents.models import Document


async def run_document_pipeline_smoke_test() -> None:
    async with AsyncSessionLocal() as session:
        document = await session.scalar(select(Document).limit(1))
        if document:
            print(f"DocIQ smoke test ready for document {document.id}")
        else:
            print("DocIQ smoke test ready. No documents loaded.")

