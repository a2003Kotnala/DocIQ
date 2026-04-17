from __future__ import annotations

from fastapi import FastAPI
from prometheus_fastapi_instrumentator import Instrumentator

from app.core.settings import get_settings


def setup_observability(app: FastAPI) -> None:
    settings = get_settings()
    if settings.prometheus_enabled:
        Instrumentator().instrument(app).expose(app, include_in_schema=False, endpoint="/metrics")

