from __future__ import annotations

from datetime import datetime, timezone

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core.logging import configure_logging
from app.core.middleware import RequestContextMiddleware
from app.core.observability import setup_observability
from app.core.runtime_paths import ensure_repo_root_on_path
from app.core.settings import get_settings
from app.modules.admin.router import router as admin_router
from app.modules.analytics.router import router as analytics_router
from app.modules.auth.router import router as auth_router
from app.modules.documents.router import router as documents_router
from app.modules.feedback.router import router as feedback_router
from app.modules.search.router import qa_router, router as search_router
from app.modules.validation.router import router as validation_router
from app.modules.workflows.router import router as workflows_router

configure_logging()
ensure_repo_root_on_path()
settings = get_settings()

app = FastAPI(title=settings.app_name, version="0.1.0", openapi_url=f"{settings.api_v1_prefix}/openapi.json")
app.add_middleware(RequestContextMiddleware)
app.add_middleware(
    CORSMiddleware,
    allow_origins=[str(origin) for origin in settings.backend_cors_origins],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

setup_observability(app)

app.include_router(auth_router, prefix=settings.api_v1_prefix)
app.include_router(documents_router, prefix=settings.api_v1_prefix)
app.include_router(validation_router, prefix=settings.api_v1_prefix)
app.include_router(search_router, prefix=settings.api_v1_prefix)
app.include_router(qa_router, prefix=settings.api_v1_prefix)
app.include_router(workflows_router, prefix=settings.api_v1_prefix)
app.include_router(feedback_router, prefix=settings.api_v1_prefix)
app.include_router(analytics_router, prefix=settings.api_v1_prefix)
app.include_router(admin_router, prefix=settings.api_v1_prefix)


@app.get("/")
async def root() -> dict:
    return {"name": settings.app_name, "status": "ok"}


@app.get("/health")
async def health() -> dict:
    return {"status": "ok", "environment": settings.environment, "time": datetime.now(timezone.utc)}

