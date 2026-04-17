from __future__ import annotations

from ai_pipeline.ocr.digital_pdf_extractor import extract_text_from_pdf


def run_tesseract(file_name: str) -> dict:
    text = extract_text_from_pdf(file_name)
    return {"text": text, "page_confidence": 0.82}

