from __future__ import annotations

import json
from functools import lru_cache
from typing import Annotated, Literal

from pydantic import AnyHttpUrl, Field, SecretStr, field_validator
from pydantic_settings import BaseSettings, NoDecode, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8", extra="ignore")

    environment: Literal["development", "staging", "production"] = "development"
    app_name: str = "DocIQ"
    api_v1_prefix: str = "/api/v1"
    backend_cors_origins: Annotated[list[AnyHttpUrl | str], NoDecode] = Field(default_factory=list)
    secret_key: SecretStr = Field(default=SecretStr("change-me"))
    jwt_algorithm: str = "HS256"
    access_token_expire_minutes: int = 15
    refresh_token_expire_days: int = 7
    database_url: str = "postgresql+asyncpg://postgres:postgres@localhost:5433/dociq"
    sync_database_url: str = "postgresql+psycopg://postgres:postgres@localhost:5433/dociq"
    redis_url: str = "redis://localhost:6379/0"
    qdrant_url: str = "http://localhost:6333"
    s3_endpoint_url: str = "http://localhost:9000"
    s3_access_key: str = "minioadmin"
    s3_secret_key: SecretStr = Field(default=SecretStr("minioadmin"))
    s3_bucket: str = "dociq"
    s3_region: str = "us-east-1"
    s3_use_ssl: bool = False
    # LLM Configuration — primary uses free models, Gemini API is the fallback
    gemini_api_key: SecretStr | None = None
    gemini_model: str = "gemini-2.0-flash"
    gemini_embedding_model: str = "models/text-embedding-004"
    # Free/self-hosted model settings
    self_hosted_llm: bool = False
    free_llm_base_url: str = "https://openrouter.ai/api/v1"
    free_llm_model: str = "google/gemma-3-27b-it:free"
    free_embedding_model: str = "BAAI/bge-small-en-v1.5"
    default_page_size: int = 20
    max_page_size: int = 100
    max_upload_size_mb: int = 50
    rate_limit_per_minute: int = 120
    otel_exporter_otlp_endpoint: str | None = None
    sentry_dsn: SecretStr | None = None
    prometheus_enabled: bool = True

    @field_validator("backend_cors_origins", mode="before")
    @classmethod
    def parse_backend_cors_origins(cls, value: object) -> object:
        if value is None:
            return []

        if isinstance(value, str):
            raw = value.strip()
            if not raw:
                return []

            # Prefer JSON when users provide it (e.g. ["http://localhost:3000"]).
            try:
                parsed = json.loads(raw)
            except json.JSONDecodeError:
                return [item.strip() for item in raw.split(",") if item.strip()]

            if isinstance(parsed, list):
                return parsed
            if isinstance(parsed, str):
                return [parsed]

            return [str(parsed)]

        return value


@lru_cache
def get_settings() -> Settings:
    return Settings()
