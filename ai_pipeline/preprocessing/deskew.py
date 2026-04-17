from __future__ import annotations


def estimate_skew(file_name: str) -> float:
    lowered = file_name.lower()
    if "rotated" in lowered:
        return 3.0
    if "scan" in lowered:
        return 1.5
    return 0.2

