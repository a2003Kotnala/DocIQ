# DocIQ

> **Enterprise document intelligence** — ingest, extract, validate, search, and act on unstructured documents at scale, with full traceability and human-in-the-loop review built in.

[![Branch](https://img.shields.io/badge/branch-Ankit%2Fdev-blue)](https://github.com/a2003Kotnala/DocIQ)
[![Python](https://img.shields.io/badge/python-3.11%2B-blue)](https://python.org)
[![Next.js](https://img.shields.io/badge/Next.js-15-black)](https://nextjs.org)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.115-green)](https://fastapi.tiangolo.com)

---

## What DocIQ Does

DocIQ turns unstructured enterprise documents — invoices, contracts, KYC files, compliance forms, onboarding packets — into structured, validated, searchable, and actionable records.

| Capability | Description |
|---|---|
| **Secure upload** | Signed object-storage URLs (MinIO / S3-compatible) |
| **AI pipeline** | Async OCR → layout → classification → extraction → validation → embedding |
| **Human review queue** | Field-level confidence scores, traceability, and correction flow |
| **Semantic search** | Tenant-scoped corpus search with citation-backed results |
| **Q&A assistant** | LLM-powered answers grounded in your own documents |
| **Workflow automation** | Event-driven workflow definitions and run tracking |
| **Multi-tenancy** | `org_id` isolation, RBAC, signed URLs, and full audit logs |
| **Observability** | Prometheus metrics, structured logging, OTEL hooks |

---

## LLM Strategy

DocIQ uses a **two-tier, OpenAI-free** LLM approach:

| Tier | Model | When Used |
|---|---|---|
| **Primary** | Free open models via OpenRouter (`google/gemma-3-27b-it:free`) | All inference by default — no API key needed |
| **Fallback** | Google Gemini API (`gemini-2.0-flash`) | When primary fails or `GEMINI_API_KEY` is set |

Set `GEMINI_API_KEY` in `.env` to enable the Gemini fallback. No OpenAI key is ever required.

---

## Architecture

DocIQ is a **modular monolith** — modules are co-located now but shaped for microservice extraction later.

```text
.
├── ai_pipeline/                # OCR, extraction, layout, embedding, NER adapters
├── backend/
│   ├── alembic/                # Database migrations
│   ├── app/
│   │   ├── core/               # Settings, DB, auth, LLM, middleware, observability, storage
│   │   │   └── llm.py          # ⭐ LLM abstraction — free model primary, Gemini fallback
│   │   ├── modules/            # Business modules (auth, documents, search, extraction…)
│   │   └── shared/             # Shared models, enums, schemas, utilities
│   ├── workers/                # Celery async worker tasks
│   └── pyproject.toml
├── config/                     # Extraction schemas, validation rules, workflow definitions
├── docs/                       # Architecture docs and runbooks
├── frontend/
│   ├── src/app/                # Next.js 15 App Router pages
│   ├── src/components/         # UI components (layout, document, search, analytics)
│   ├── src/api/                # Typed API clients (auth, documents, search, analytics)
│   ├── src/stores/             # Zustand state (auth, UI, document viewer)
│   └── package.json
├── scripts/                    # Seed, export, smoke-test helpers
├── tests/                      # Backend, frontend, and AI pipeline tests
└── docker-compose.yml          # Local infrastructure (Postgres, Redis, Qdrant, MinIO)
```

---

## Tech Stack

### Backend
- **FastAPI** — async REST API
- **SQLAlchemy 2** + **PostgreSQL 16** — ORM and primary datastore
- **Celery + Redis** — async task queue for heavy pipeline stages
- **MinIO / S3** — document blob storage
- **Qdrant** — vector database for semantic search
- **httpx + tenacity** — resilient LLM API calls (Gemini / OpenRouter)
- **Prometheus + structlog** — observability and structured logging

### Frontend
- **Next.js 15** (App Router) + **React 19** + **TypeScript**
- **Tailwind CSS v4** — utility styling
- **Zustand** — client state management
- **TanStack Query** — server state and caching
- **Recharts** — analytics charts
- **Lucide React** — icons
- **Radix UI** — accessible primitives

### AI / Pipeline
- Development: deterministic adapters (runs without external models)
- Production-shaped modules for OCR, layout, classification, extraction, embeddings, and NER

---

## Prerequisites

- [Docker Desktop](https://www.docker.com/products/docker-desktop)
- Python 3.11+
- Node.js 20+ and npm

---

## Quick Start

> All commands are written for **PowerShell on Windows**.

### 1. Clone and configure environment

```powershell
# Copy environment template
Copy-Item .env.example .env
```

Open `.env` and set your `GEMINI_API_KEY` if you want the Gemini fallback active. The system works without it using free models.

Default local ports:

| Service | URL |
|---|---|
| Frontend | `http://127.0.0.1:3000` |
| Backend API | `http://127.0.0.1:8000` |
| Swagger UI | `http://127.0.0.1:8000/docs` |
| PostgreSQL | `localhost:5433` |
| MinIO API | `http://127.0.0.1:9000` |
| MinIO Console | `http://127.0.0.1:9001` |
| Flower | `http://127.0.0.1:5555` |
| MailHog | `http://127.0.0.1:8025` |
| Qdrant | `http://127.0.0.1:6333` |

### 2. Start infrastructure

```powershell
docker compose up -d
```

Starts PostgreSQL, Redis, Qdrant, MinIO, Flower, and MailHog.

### 3. Set up the backend

```powershell
Set-Location backend
py -3.11 -m venv .venv
.\.venv\Scripts\Activate.ps1
python -m pip install --upgrade pip setuptools wheel
python -m pip install --no-build-isolation -e ".[dev]"
```

### 4. Run database migrations

```powershell
alembic upgrade head
```

### 5. Seed development data

```powershell
Set-Location ..
python .\scripts\seed_data.py
```

Seeds a sample organization, roles, document types, validation rules, workflows, and an admin user.

### 6. Start the backend API

```powershell
Set-Location .\backend
.\.venv\Scripts\Activate.ps1
uvicorn app.main:app --reload --host 127.0.0.1 --port 8000
```

### 7. Start the Celery worker

Open a new terminal:

```powershell
Set-Location .\backend
.\.venv\Scripts\Activate.ps1
celery -A app.core.celery_app worker --loglevel=info -Q high_priority,batch,background
```

> **Windows note:** DocIQ defaults Celery to the `solo` pool to avoid `billiard`/`prefork` permission errors.

### 8. Start the frontend

Open a new terminal:

```powershell
Set-Location .\frontend
npm install
npm run dev
```

---

## Development Login

```
Email:    admin@dociq.test
Password: password123
Org slug: seed-org
```

---

## Common Commands

```powershell
# Backend tests
Set-Location backend
pytest

# Frontend tests
Set-Location frontend
npm run test

# Lint backend
Set-Location backend
ruff check .

# Export feedback training data
python .\scripts\export_training_data.py

# Pipeline smoke test
python .\scripts\run_pipeline_test.py

# Check all Python compiles cleanly
@'
import compileall
ok = all([
    compileall.compile_dir("backend", quiet=1),
    compileall.compile_dir("ai_pipeline", quiet=1),
    compileall.compile_dir("scripts", quiet=1),
])
print("OK" if ok else "FAIL")
'@ | python -
```

---

## Environment Variables Reference

| Variable | Description | Default |
|---|---|---|
| `GEMINI_API_KEY` | Google Gemini API key (fallback LLM) | `change-me` |
| `GEMINI_MODEL` | Gemini model name | `gemini-2.0-flash` |
| `FREE_LLM_BASE_URL` | OpenRouter base URL | `https://openrouter.ai/api/v1` |
| `FREE_LLM_MODEL` | Free OpenRouter model | `google/gemma-3-27b-it:free` |
| `DATABASE_URL` | PostgreSQL async URL | `postgresql+asyncpg://…` |
| `REDIS_URL` | Redis connection URL | `redis://localhost:6379/0` |
| `QDRANT_URL` | Qdrant server URL | `http://localhost:6333` |
| `S3_ENDPOINT_URL` | MinIO/S3 endpoint | `http://localhost:9000` |
| `SECRET_KEY` | JWT signing key — **change in production** | `change-me` |
| `RATE_LIMIT_PER_MINUTE` | API rate limit per client | `120` |
| `PROMETHEUS_ENABLED` | Expose `/metrics` endpoint | `true` |

---

## Security Highlights

- **Tenant isolation**: every data row carries `org_id`; queries are always scoped
- **RBAC**: role and permission model with per-user enforcement
- **Audit log**: all mutations write to the audit log table
- **Signed upload URLs**: documents never pass through the API process
- **Background execution**: heavy pipeline stages run in Celery workers, not request handlers
- **Idempotency keys**: each pipeline job is deduplicated at the worker level
- **JWT auth**: short-lived access tokens (15 min) + refresh tokens (7 days)
- **No OpenAI dependency**: no third-party AI provider required by default

---

## Troubleshooting

| Problem | Fix |
|---|---|
| `ModuleNotFoundError` on scripts | Activate the backend `.venv` first |
| `structlog` or deps missing | Re-run `pip install -e ".[dev]"` from `backend/` |
| DB migration fails | Run `docker compose ps` — ensure PostgreSQL is healthy |
| Frontend can't reach backend | Confirm `BACKEND_CORS_ORIGINS` in `.env` includes `http://127.0.0.1:3000` |
| Celery worker crashes on Windows | The `solo` pool is set automatically — no action needed |
| LLM calls fail | Check `GEMINI_API_KEY` in `.env`; free-tier primary runs without a key |

---

## Roadmap

- [ ] Replace ILIKE search with true Qdrant dense+sparse hybrid retrieval
- [ ] Wire PaddleOCR and PP-Structure into pipeline adapters
- [ ] Add streaming SSE endpoint for assistant responses
- [ ] Full integration test suite with Docker test services
- [ ] Production Kubernetes manifests
- [ ] Real-time notification websocket for review queue updates
