from __future__ import annotations

from qdrant_client import QdrantClient

from app.core.settings import get_settings


def get_qdrant_client() -> QdrantClient:
    settings = get_settings()
    return QdrantClient(url=settings.qdrant_url)

