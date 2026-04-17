from __future__ import annotations

from pydantic import BaseModel, Field


class SearchFilters(BaseModel):
    document_type_id: str | None = None
    document_ids: list[str] = Field(default_factory=list)
    validation_status: str | None = None


class SearchRequest(BaseModel):
    query: str
    filters: SearchFilters = Field(default_factory=SearchFilters)
    page: int = 1
    page_size: int = 10


class AskRequest(BaseModel):
    question: str
    filters: SearchFilters = Field(default_factory=SearchFilters)
    conversation_history: list[dict] = Field(default_factory=list)


class SearchFeedbackRequest(BaseModel):
    search_query_id: str
    rating: int
    preferred_answer: str | None = None
    reason: str | None = None

