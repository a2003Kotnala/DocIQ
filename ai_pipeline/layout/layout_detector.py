from __future__ import annotations

from ai_pipeline.layout.reading_order import assign_reading_order
from ai_pipeline.layout.table_extractor import detect_tables


def detect_layout(text: str) -> list[dict]:
    elements = []
    for index, line in enumerate([line for line in text.splitlines() if line.strip()], start=1):
        element_type = "Title" if index == 1 else "NarrativeText"
        if ":" in line:
            element_type = "FormField"
        elements.append(
            {
                "element_type": element_type,
                "bbox": {"x": 100, "y": 100 + (index * 36), "width": 900, "height": 24},
                "text": line,
                "confidence": 0.9,
            }
        )
    tables = detect_tables(text)
    return assign_reading_order(elements + [{"element_type": "Table", "bbox": {}, "text": None, "table_data": table, "confidence": table["confidence"]} for table in tables])

