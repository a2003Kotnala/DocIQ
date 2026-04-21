# DocIQ

DocIQ is an enterprise AI document intelligence platform for ingesting unstructured documents and turning them into structured, validated, traceable, searchable, and actionable records.

This repository is organized as a modular monolith so the heavy compute stages can be extracted into microservices later without rewriting the core product.

## What DocIQ Does

DocIQ is designed to support enterprise document operations across invoices, contracts, KYC files, compliance forms, reports, and other operational paperwork.

Core capabilities in this repository:

- Secure document upload using signed object-storage URLs
- Async preprocessing, OCR, layout analysis, classification, extraction, validation, embedding, and workflow stages
- Human review queue with field-level confidence and traceability
- Semantic search and citation-backed Q&A endpoints
- Workflow definitions and workflow run tracking
- Multi-tenant data model with RBAC, audit logging, and org isolation
- Analytics, feedback capture, and model/version tracking scaffolding

## Architecture Summary

DocIQ is implemented as a modular monolith with four major layers:

1. `backend/app/core`
   Platform concerns such as settings, auth helpers, DB access, storage, observability, middleware, audit logging, and Celery wiring.
2. `backend/app/modules`
   Business modules: `auth`, `documents`, `extraction`, `validation`, `search`, `workflows`, `feedback`, `analytics`, and `admin`.
3. `backend/workers`
   Async worker entrypoints for pipeline stages. Heavy work never runs in request handlers.
4. `ai_pipeline`
   Provider-style adapters for preprocessing, OCR, layout, classification, extraction, embedding, and NER.

The current local-development implementation uses deterministic adapters for the AI stages so the system can run without real model infrastructure. The interfaces are shaped so PaddleOCR, PP-Structure, real LLM extraction, and production retrieval providers can replace them cleanly.

## Repository Layout

```text
.
├── ai_pipeline/                # OCR, extraction, layout, embedding, and other AI adapters
├── backend/
│   ├── alembic/                # migrations
│   ├── app/
│   │   ├── core/               # config, db, auth, middleware, observability, storage
│   │   ├── modules/            # domain modules
│   │   └── shared/             # shared models, enums, schemas, utilities
│   ├── workers/                # Celery worker task modules
│   ├── Dockerfile
│   └── pyproject.toml
├── config/                     # sample extraction schemas, validation rules, workflows
├── docs/                       # architecture and runbook docs
├── frontend/
│   ├── src/app/                # Next.js App Router pages
│   ├── src/components/         # UI and feature components
│   ├── src/api/                # frontend API clients
│   ├── src/stores/             # Zustand stores
│   └── package.json
├── scripts/                    # seed/export/smoke helpers
├── tests/                      # backend, frontend, and AI pipeline tests
└── docker-compose.yml          # local infrastructure services
```

## Tech Stack

### Backend

- FastAPI
- SQLAlchemy
- PostgreSQL 16
- Celery + Redis
- MinIO / S3-compatible storage
- Qdrant
- Prometheus instrumentation hooks
- Structured logging + middleware hooks for tracing

### Frontend

- Next.js 15
- React 19
- TypeScript
- Zustand
- TanStack Query
- Tailwind
- `react-pdf`

### AI / Pipeline

- Deterministic development adapters today
- Production-shaped modules for preprocessing, OCR, layout detection, classification, extraction, validation, embeddings, and workflows

## Prerequisites

Install these first:

- Docker Desktop
- Python 3.11+
- Node.js 20+
- npm

Optional but recommended:

- A virtual environment for Python
- An OpenAI API key for future non-deterministic extraction work

## Environment Setup

1. Copy the environment template:

```powershell
Copy-Item .env.example .env
```

2. Review `.env` and change any values you need.

The defaults are set up for local development:

- PostgreSQL on `localhost:5433`
- Redis on `localhost:6379`
- Qdrant on `localhost:6333`
- MinIO on `localhost:9000`
- Backend on `localhost:8000`
- Frontend on `localhost:3000`

## How To Run The Project

These steps are written for PowerShell on Windows.

### 1. Start local infrastructure

From the repository root:

```powershell
docker compose up -d
```

This starts:

- PostgreSQL on host port `5433`
- Redis
- Qdrant
- MinIO
- Flower
- MailHog

### 2. Install backend dependencies

```powershell
Set-Location backend
py -3.11 -m venv .venv
.\.venv\Scripts\Activate.ps1
python -m pip install --upgrade pip setuptools wheel
python -m pip install --no-build-isolation -e ".[dev]"
```

### 3. Run database migrations

Still from `backend/`:

```powershell
alembic upgrade head
```

### 4. Seed the development data

From the repository root in a shell where the backend virtualenv is active:

```powershell
Set-Location ..
python .\scripts\seed_data.py
```

This seeds:

- a sample organization
- default roles
- sample document types from `config/schemas`
- sample validation rules from `config/rules`
- sample workflows from `config/workflows`
- a development admin user

### 5. Start the backend API

Open a terminal, activate the backend virtualenv, then run:

```powershell
Set-Location .\backend
.\.venv\Scripts\Activate.ps1
uvicorn app.main:app --reload --host 127.0.0.1 --port 8000
```

Backend URLs:

- API root: `http://127.0.0.1:8000/`
- Health: `http://127.0.0.1:8000/health`
- OpenAPI JSON: `http://127.0.0.1:8000/api/v1/openapi.json`
- Swagger UI: `http://127.0.0.1:8000/docs`

### 6. Start the background worker

Open a second terminal, activate the backend virtualenv, then run:

```powershell
Set-Location .\backend
.\.venv\Scripts\Activate.ps1
celery -A app.core.celery_app worker --loglevel=info -Q high_priority,batch,background
```

On Windows, DocIQ now defaults Celery to the `solo` pool automatically to avoid the `prefork` permission errors that commonly appear with `billiard`.

Optional:

- Flower UI: `http://127.0.0.1:5555`

### 7. Install frontend dependencies

Open a third terminal:

```powershell
Set-Location .\frontend
npm install
```

### 8. Start the frontend

From `frontend/`:

```powershell
npm run dev
```

Frontend URL:

- `http://127.0.0.1:3000`

## Development Login

After running the seed script, use:

- Email: `admin@dociq.test`
- Password: `password123`
- Org slug: `seed-org`

## Local Service URLs

- Frontend: `http://127.0.0.1:3000`
- Backend: `http://127.0.0.1:8000`
- Swagger UI: `http://127.0.0.1:8000/docs`
- PostgreSQL: `localhost:5433`
- MinIO API: `http://127.0.0.1:9000`
- MinIO Console: `http://127.0.0.1:9001`
- Flower: `http://127.0.0.1:5555`
- MailHog: `http://127.0.0.1:8025`
- Qdrant: `http://127.0.0.1:6333`

## Common Commands

### Backend tests

From `backend/` with the virtualenv active:

```powershell
pytest
```

### AI pipeline smoke compilation

From the repo root:

```powershell
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

### Frontend tests

From `frontend/`:

```powershell
npm run test
```

### Export feedback training data

From the repo root, with the backend virtualenv active:

```powershell
python .\scripts\export_training_data.py
```

### Pipeline smoke helper

From the repo root, with the backend virtualenv active:

```powershell
python .\scripts\run_pipeline_test.py
```

## Current Implementation Notes

Important for local development:

- The AI pipeline is currently deterministic and development-oriented. It is shaped like a production system, but it does not yet require live PaddleOCR, PP-Structure, or hosted LLMs to execute the local path.
- Search is scaffolded and tenant-aware, but the current search implementation is simplified compared to the full blueprint.
- The review and workflow surfaces are present in the backend and frontend, but many enterprise-grade integrations are still placeholder implementations.
- The initial Alembic migration creates the schema from SQLAlchemy metadata in one revision. Future migrations should be authored incrementally.

## Troubleshooting

### `ModuleNotFoundError` when running backend scripts

Activate the backend virtual environment before running `scripts/*.py`.

### `structlog` or other imports are missing

You have not installed backend dependencies yet. Re-run:

```powershell
Set-Location .\backend
.\.venv\Scripts\Activate.ps1
python -m pip install --upgrade pip setuptools wheel
python -m pip install --no-build-isolation -e ".[dev]"
```

### Database migration fails

Make sure PostgreSQL is running via Docker:

```powershell
docker compose ps
```

### Frontend cannot reach backend

Confirm the backend is running on `127.0.0.1:8000` and that CORS origins in `.env` include `http://127.0.0.1:3000`.

## Security and Enterprise Concerns Built Into The Repo

- `org_id` on tenant-scoped records
- RBAC model with roles and permissions
- audit log table and audit-writing hooks
- signed upload URL flow
- background execution for heavy stages
- per-stage job records with idempotency keys
- worker failure handling that marks failed jobs and documents
- observability hooks via middleware and Prometheus instrumentation

## Next Recommended Steps

If you want to take this from scaffolded enterprise platform to a more fully running system, the best next steps are:

1. Install and wire real OCR, layout, and LLM providers.
2. Add full database-backed integration tests using Docker test services.
3. Tighten the frontend authentication bootstrap and form flows.
4. Replace simplified search with true dense + sparse hybrid retrieval and reranking.
5. Add richer review actions and real workflow action handlers.
