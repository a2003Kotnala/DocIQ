from __future__ import annotations

from decimal import Decimal


def evaluate_rule(rule: dict, fields: dict[str, dict]) -> tuple[str, str | None]:
    rule_type = rule.get("rule_type")
    if rule_type == "range":
        field_name = rule["field_name"]
        raw_value = fields.get(field_name, {}).get("value")
        if raw_value is None:
            return "FAILED", f"Missing field {field_name}"
        cleaned = str(raw_value).replace("$", "").replace(",", "")
        value = Decimal(cleaned)
        minimum = Decimal(str(rule.get("config", {}).get("min", 0)))
        maximum = Decimal(str(rule.get("config", {}).get("max", "999999999")))
        if minimum <= value <= maximum:
            return "PASSED", None
        return "FAILED", f"Value {value} is outside configured range"
    if rule_type == "cross_field":
        expression = rule.get("expression", "")
        if "invoice_date <= due_date" in expression:
            invoice_date = fields.get("invoice_date", {}).get("value")
            due_date = fields.get("due_date", {}).get("value")
            if not invoice_date or not due_date or invoice_date <= due_date:
                return "PASSED", None
            return "FAILED", rule.get("message")
        if "effective_date < termination_date" in expression:
            start = fields.get("effective_date", {}).get("value")
            end = fields.get("termination_date", {}).get("value")
            if not start or not end or start < end:
                return "PASSED", None
            return "FAILED", rule.get("message")
    return "SKIPPED", None

