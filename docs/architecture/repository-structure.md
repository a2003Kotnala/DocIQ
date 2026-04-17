# Repository Structure

```text
backend/
  app/
    core/
    modules/
    shared/
  workers/
  alembic/
ai_pipeline/
frontend/
config/
tests/
docs/
```

- `core` owns platform services.
- `modules` own business domains.
- `workers` execute all heavy stages asynchronously.
- `ai_pipeline` contains provider adapters and deterministic stage logic.
- `config` contains organization-configurable schemas, rules, and workflows.

