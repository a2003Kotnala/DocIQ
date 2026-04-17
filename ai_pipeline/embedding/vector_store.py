from __future__ import annotations

from uuid import uuid4

from qdrant_client.http import models

from app.core.qdrant import get_qdrant_client


def ensure_collection(collection_name: str, vector_size: int) -> None:
    try:
        client = get_qdrant_client()
        existing = {collection.name for collection in client.get_collections().collections}
        if collection_name not in existing:
            client.recreate_collection(
                collection_name=collection_name,
                vectors_config=models.VectorParams(size=vector_size, distance=models.Distance.COSINE),
            )
    except Exception:
        return


def upsert_vectors(collection_name: str, points: list[dict]) -> list[str]:
    point_ids = [point.get("id", str(uuid4())) for point in points]
    try:
        ensure_collection(collection_name, len(points[0]["vector"]) if points else 16)
        client = get_qdrant_client()
        client.upsert(
            collection_name=collection_name,
            points=[
                models.PointStruct(id=point_id, vector=point["vector"], payload=point["payload"])
                for point_id, point in zip(point_ids, points, strict=False)
            ],
        )
    except Exception:
        return point_ids
    return point_ids
