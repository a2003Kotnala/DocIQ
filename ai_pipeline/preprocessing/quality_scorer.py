from __future__ import annotations


def score_quality(file_name: str, file_format: str) -> float:
    base = 0.92 if file_format.lower() == "pdf" else 0.85
    lowered = file_name.lower()
    if "blurry" in lowered or "shadow" in lowered:
        base -= 0.35
    if "scan" in lowered:
        base -= 0.12
    if "mobile" in lowered:
        base -= 0.1
    return max(0.1, min(base, 0.99))

