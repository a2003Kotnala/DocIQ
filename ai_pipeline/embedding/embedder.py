from __future__ import annotations

import hashlib


def embed_text(text: str, dimensions: int = 16) -> list[float]:
    digest = hashlib.sha256(text.encode("utf-8")).digest()
    vector = []
    for index in range(dimensions):
        vector.append(round(digest[index] / 255, 6))
    return vector

