from __future__ import annotations


def classify_document(file_name: str, text: str) -> dict:
    lowered = f"{file_name} {text}".lower()
    if "invoice" in lowered or "amount" in lowered:
        return {"document_type": "invoice", "confidence": 0.96, "alternatives": [{"type": "receipt", "confidence": 0.03}]}
    if "agreement" in lowered or "termination" in lowered:
        return {"document_type": "contract", "confidence": 0.91, "alternatives": [{"type": "nda", "confidence": 0.05}]}
    return {"document_type": "general_document", "confidence": 0.62, "alternatives": [{"type": "report", "confidence": 0.31}]}

