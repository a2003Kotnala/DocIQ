from __future__ import annotations

import re


FIELD_PATTERNS = {
    "invoice_number": re.compile(r"INV[- ]?[0-9]{4,10}", re.IGNORECASE),
    "invoice_date": re.compile(r"\b20[0-9]{2}-[0-9]{2}-[0-9]{2}\b"),
    "total_amount": re.compile(r"\$?[0-9,]+\.[0-9]{2}"),
    "effective_date": re.compile(r"\b20[0-9]{2}-[0-9]{2}-[0-9]{2}\b"),
    "termination_date": re.compile(r"\b20[0-9]{2}-[0-9]{2}-[0-9]{2}\b"),
}

