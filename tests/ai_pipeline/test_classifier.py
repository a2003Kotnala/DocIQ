from ai_pipeline.classification.classifier import classify_document


def test_classifier_detects_invoice() -> None:
    result = classify_document("invoice-april.pdf", "Invoice Total Amount")
    assert result["document_type"] == "invoice"
    assert result["confidence"] > 0.9

