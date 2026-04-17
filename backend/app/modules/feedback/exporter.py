from __future__ import annotations

import json
from pathlib import Path


def export_feedback_dataset(destination: Path) -> None:
    sample_records = [
        {
            "feedback_type": "field_correction",
            "document_type": "invoice",
            "field_name": "total_amount",
            "original_value": {"value": "1500.0"},
            "corrected_value": {"value": "15000.0"},
        }
    ]
    with destination.open("w", encoding="utf-8") as handle:
        for record in sample_records:
            handle.write(json.dumps(record) + "\n")

