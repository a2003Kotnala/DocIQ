from __future__ import annotations

from celery import Celery

from app.core.settings import get_settings


settings = get_settings()

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
)

