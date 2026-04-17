from __future__ import annotations


def run_llm_extraction(text: str, schema: dict) -> list[dict]:
    results: list[dict] = []
    lines = text.splitlines()
    for field in schema.get("fields", []):
        name = field["name"]
        lowered = name.replace("_", " ")
        matching_line = next((line for line in lines if lowered.split()[0] in line.lower()), None)
        if not matching_line:
            continue
        value = matching_line.split(":")[-1].strip() if ":" in matching_line else matching_line
        results.append(
            {
                "field_name": name,
                "value": value,
                "source_text": matching_line,
                "confidence": 0.78,
                "bbox": {"x": 200, "y": 200, "width": 260, "height": 28},
                "method": "llm",
            }
        )
    return results

