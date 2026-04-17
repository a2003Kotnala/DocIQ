"""Initial DocIQ schema.

Revision ID: 20260417_0001
Revises:
Create Date: 2026-04-17 21:45:00
"""

from __future__ import annotations

from alembic import op

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


revision = "20260417_0001"
down_revision = None
branch_labels = None
depends_on = None


def upgrade() -> None:
    bind = op.get_bind()
    Base.metadata.create_all(bind=bind)


def downgrade() -> None:
    bind = op.get_bind()
    Base.metadata.drop_all(bind=bind)

