from ai_pipeline.embedding.chunker import chunk_text


def test_chunk_text_splits_large_payload() -> None:
    chunks = chunk_text("word " * 300, max_words=100)
    assert len(chunks) == 3

