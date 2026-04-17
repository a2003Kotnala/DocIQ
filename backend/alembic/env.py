from __future__ import annotations

from logging.config import fileConfig

from alembic import context
from sqlalchemy import engine_from_config, pool

from app.core.settings import get_settings
from app.modules.auth import models as auth_models  # noqa: F401
from app.modules.documents import models as documents_models  # noqa: F401
from app.modules.extraction import models as extraction_models  # noqa: F401
from app.modules.feedback import models as feedback_models  # noqa: F401
from app.modules.search import models as search_models  # noqa: F401
from app.modules.validation import models as validation_models  # noqa: F401
from app.modules.workflows import models as workflow_models  # noqa: F401
from app.shared.models import audit as audit_models  # noqa: F401
from app.shared.models import ml as ml_models  # noqa: F401
from app.shared.models.base import Base

config = context.config
settings = get_settings()
config.set_main_option("sqlalchemy.url", settings.sync_database_url)

if config.config_file_name is not None:
    fileConfig(config.config_file_name)

target_metadata = Base.metadata


def run_migrations_offline() -> None:
    context.configure(url=settings.sync_database_url, target_metadata=target_metadata, literal_binds=True)
    with context.begin_transaction():
        context.run_migrations()


def run_migrations_online() -> None:
    connectable = engine_from_config(
        config.get_section(config.config_ini_section) or {},
        prefix="sqlalchemy.",
        poolclass=pool.NullPool,
    )
    with connectable.connect() as connection:
        context.configure(connection=connection, target_metadata=target_metadata)
        with context.begin_transaction():
            context.run_migrations()


if context.is_offline_mode():
    run_migrations_offline()
else:
    run_migrations_online()

