from app.modules.validation.rule_evaluator import evaluate_rule


def test_range_rule_passes_for_valid_amount() -> None:
    status, message = evaluate_rule(
        {
            "rule_type": "range",
            "field_name": "total_amount",
            "config": {"min": 1, "max": 100},
        },
        {"total_amount": {"value": "$50.00"}},
    )
    assert status == "PASSED"
    assert message is None


def test_cross_field_rule_fails_for_inverted_contract_dates() -> None:
    status, message = evaluate_rule(
        {
            "rule_type": "cross_field",
            "expression": "effective_date < termination_date",
            "message": "Dates are inverted",
        },
        {
            "effective_date": {"value": "2026-02-01"},
            "termination_date": {"value": "2026-01-01"},
        },
    )
    assert status == "FAILED"
    assert message == "Dates are inverted"

