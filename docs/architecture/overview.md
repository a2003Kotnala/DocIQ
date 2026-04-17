# DocIQ Architecture Overview

DocIQ is a modular monolith with these core layers:

1. `app.core`
   Common platform concerns: settings, logging, DB, middleware, auth, storage, queue, observability.
2. `app.modules`
   Domain modules with routers, services, models, and schemas. Modules may depend on `app.core` and `app.shared`, but not on each other’s routers.
3. `ai_pipeline`
   Provider-agnostic pipeline functions for preprocessing, OCR, layout, classification, extraction, validation, and embeddings.
4. `workers`
   Celery task entrypoints that invoke `ai_pipeline` and update the database through services.

This structure keeps synchronous request handlers thin and ensures OCR, extraction, embedding, workflow execution, and retry logic always run off-request.

