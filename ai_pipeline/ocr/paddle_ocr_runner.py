from __future__ import annotations

from ai_pipeline.ocr.digital_pdf_extractor import extract_text_from_pdf


def run_paddle_ocr(file_name: str) -> dict:
    text = extract_text_from_pdf(file_name)
    lines = [line for line in text.splitlines() if line.strip()]
    return {
        "lines": [
            {
                "text": line,
                "bbox": {"x": 100, "y": 100 + (index * 36), "width": 900, "height": 24},
                "confidence": 0.94,
            }
            for index, line in enumerate(lines)
        ],
        "words": [],
        "page_confidence": 0.94,
    }

