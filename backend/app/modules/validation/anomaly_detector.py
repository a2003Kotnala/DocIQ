from __future__ import annotations


def detect_anomalies(fields: dict[str, dict]) -> list[dict]:
    anomalies = []
    amount = fields.get("total_amount", {}).get("value")
    if amount and str(amount).replace("$", "").replace(",", "").startswith("50000"):
        anomalies.append({"type": "round_number", "message": "Suspicious round invoice amount"})
    return anomalies

