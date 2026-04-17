from __future__ import annotations

import hashlib
from typing import Any


def make_idempotency_key(*parts: Any) -> str:
    raw = ":".join(str(part) for part in parts)
    return hashlib.sha256(raw.encode("utf-8")).hexdigest()

