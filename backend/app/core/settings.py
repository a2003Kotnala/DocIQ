from __future__ import annotations

from functools import lru_cache
from typing import Literal

from pydantic import AnyHttpUrl, Field, SecretStr
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8", extra="ignore")

    environment: Literal["development", "staging", "production"] = "development"
    app_name: str = "DocIQ"
    api_v1_prefix: str = "/api/v1"
    backend_cors_origins: list[AnyHttpUrl | str] = Field(default_factory=list)
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
    openai_api_key: SecretStr | None = None
    openai_embedding_model: str = "text-embedding-3-small"
    openai_extraction_model: str = "gpt-4o-mini"
    self_hosted_llm: bool = False
    default_page_size: int = 20
    max_page_size: int = 100
    max_upload_size_mb: int = 50
    rate_limit_per_minute: int = 120
    otel_exporter_otlp_endpoint: str | None = None
    sentry_dsn: SecretStr | None = None
    prometheus_enabled: bool = True


@lru_cache
def get_settings() -> Settings:
    return Settings()
