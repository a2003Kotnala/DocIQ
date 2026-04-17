import asyncio

from app.modules.documents.pipeline import run_document_pipeline_smoke_test


if __name__ == "__main__":
    asyncio.run(run_document_pipeline_smoke_test())

