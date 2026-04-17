# Local Development Runbook

## Start Infrastructure

```bash
docker compose up -d
```

## Run Migrations

```bash
cd backend
alembic upgrade head
```

## Start API

```bash
cd backend
uvicorn app.main:app --reload --port 8000
```

## Start Worker

```bash
cd backend
celery -A app.core.celery_app worker --loglevel=info -Q high_priority,batch,background
```

## Start Frontend

```bash
cd frontend
npm install
npm run dev
```

