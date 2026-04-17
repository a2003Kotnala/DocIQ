from __future__ import annotations


def calibrate_confidence(raw_confidence: float) -> float:
    if raw_confidence >= 0.98:
        return 0.99
    if raw_confidence <= 0.5:
        return 0.55
    return round((0.85 * raw_confidence) + 0.12, 4)

