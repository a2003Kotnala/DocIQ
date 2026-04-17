from __future__ import annotations


def estimate_noise(file_name: str) -> float:
    lowered = file_name.lower()
    if "fax" in lowered:
        return 0.35
    if "scan" in lowered:
        return 0.2
    return 0.05

