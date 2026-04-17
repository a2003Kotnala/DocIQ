"""Initial DocIQ schema.

Revision ID: 20260417_0001
Revises:
Create Date: 2026-04-17 21:45:00
"""

from __future__ import annotations

from alembic import op

from app.shared.models import *  # noqa: F403
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

