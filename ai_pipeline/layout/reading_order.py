from __future__ import annotations


def assign_reading_order(elements: list[dict]) -> list[dict]:
    for index, element in enumerate(elements, start=1):
        element["reading_order"] = index
    return elements

