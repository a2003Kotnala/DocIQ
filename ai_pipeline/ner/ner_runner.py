from __future__ import annotations

import re


def extract_entities(text: str) -> list[dict]:
    entities = []
    for match in re.finditer(r"\b[A-Z][a-z]+(?: [A-Z][a-z]+)+\b", text):
        entities.append({"text": match.group(0), "label": "ORG", "confidence": 0.7})
    for match in re.finditer(r"\$[0-9,]+\.[0-9]{2}", text):
        entities.append({"text": match.group(0), "label": "MONEY", "confidence": 0.95})
    return entities

