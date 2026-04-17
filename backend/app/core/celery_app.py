from __future__ import annotations

import os

from celery import Celery

from app.core.runtime_paths import ensure_repo_root_on_path
from app.core.settings import get_settings

ensure_repo_root_on_path()

settings = get_settings()
is_windows = os.name == "nt"

celery_app = Celery(
    "dociq",
    broker=settings.redis_url,
    backend=settings.redis_url,
    include=[
        "workers.preprocessing_worker",
        "workers.ocr_worker",
        "workers.layout_worker",
        "workers.classification_worker",
        "workers.extraction_worker",
        "workers.validation_worker",
        "workers.embedding_worker",
        "workers.workflow_worker",
    ],
)

worker_runtime_config = {"worker_pool": "solo", "worker_concurrency": 1} if is_windows else {"worker_pool": "prefork"}

celery_app.conf.update(
    task_serializer="json",
    result_serializer="json",
    accept_content=["json"],
    task_default_queue="high_priority",
    task_routes={
        "workers.embedding_worker.*": {"queue": "background"},
        "workers.workflow_worker.*": {"queue": "background"},
    },
    task_acks_late=True,
    worker_prefetch_multiplier=1,
    **worker_runtime_config,
)

