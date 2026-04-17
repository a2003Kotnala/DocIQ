from __future__ import annotations


def detect_tables(text: str) -> list[dict]:
    rows = [line.split(",") for line in text.splitlines() if "," in line]
    if not rows:
        return []
    return [{"headers": rows[0], "rows": rows[1:], "confidence": 0.8}]

