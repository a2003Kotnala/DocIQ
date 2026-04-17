from __future__ import annotations

from ai_pipeline.extraction.rule_engine.pattern_library import FIELD_PATTERNS


def run_rule_extraction(text: str, schema: dict) -> list[dict]:
    results: list[dict] = []
    for field in schema.get("fields", []):
        name = field["name"]
        pattern = FIELD_PATTERNS.get(name)
        if not pattern:
            continue
        match = pattern.search(text)
        if not match:
            continue
        results.append(
            {
                "field_name": name,
                "value": match.group(0),
                "source_text": match.group(0),
                "confidence": 0.91,
                "bbox": {"x": 180, "y": 180, "width": 240, "height": 26},
                "method": "rule",
            }
        )
    return results

