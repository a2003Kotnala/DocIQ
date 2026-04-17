import asyncio
import sys
from pathlib import Path

BACKEND_DIR = Path(__file__).resolve().parents[1] / "backend"
if str(BACKEND_DIR) not in sys.path:
    sys.path.insert(0, str(BACKEND_DIR))

from app.modules.documents.pipeline import run_document_pipeline_smoke_test


if __name__ == "__main__":
    asyncio.run(run_document_pipeline_smoke_test())

