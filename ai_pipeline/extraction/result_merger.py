from __future__ import annotations


def merge_results(rule_results: list[dict], llm_results: list[dict]) -> list[dict]:
    merged: dict[str, dict] = {result["field_name"]: result for result in llm_results}
    for result in rule_results:
        existing = merged.get(result["field_name"])
        if not existing or result["confidence"] >= existing["confidence"]:
            result["candidate_values"] = [candidate for candidate in [existing] if candidate]
            merged[result["field_name"]] = result
        elif existing:
            existing.setdefault("candidate_values", []).append(result)
    return list(merged.values())

