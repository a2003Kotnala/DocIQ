from __future__ import annotations


def extract_text_from_pdf(file_name: str) -> str:
    lowered = file_name.lower()
    if "invoice" in lowered:
        return (
            "Invoice Number INV-20481\n"
            "Invoice Date 2026-04-17\n"
            "Vendor Acme Supplies\n"
            "Total Amount $15420.00\n"
            "Due Date 2026-05-17\n"
        )
    if "contract" in lowered:
        return (
            "Master Services Agreement\n"
            "This agreement is between DocIQ Corp and Blue River LLC.\n"
            "Effective Date: 2026-01-01\n"
            "Termination Date: 2027-01-01\n"
        )
    return f"Document {file_name}\nGenerated OCR text for DocIQ pipeline.\n"

