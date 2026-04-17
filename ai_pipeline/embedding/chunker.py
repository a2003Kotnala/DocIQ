from __future__ import annotations


def chunk_text(text: str, max_words: int = 120) -> list[str]:
    words = text.split()
    if not words:
        return []
    chunks = []
    for start in range(0, len(words), max_words):
        chunks.append(" ".join(words[start : start + max_words]))
    return chunks

