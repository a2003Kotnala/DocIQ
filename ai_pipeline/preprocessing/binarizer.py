from __future__ import annotations


def normalize_mode(file_format: str) -> str:
    if file_format.lower() in {"png", "jpg", "jpeg", "tiff"}:
        return "grayscale"
    return "native"

