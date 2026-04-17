from __future__ import annotations

from sqlalchemy import JSON, String, Text
from sqlalchemy.dialects.postgresql import ARRAY, JSONB
from sqlalchemy.sql.type_api import TypeEngine

JSON_VARIANT: TypeEngine = JSON().with_variant(JSONB(), "postgresql")
TEXT_ARRAY_VARIANT: TypeEngine = JSON().with_variant(ARRAY(Text()), "postgresql")
STRING_ARRAY_VARIANT: TypeEngine = JSON().with_variant(ARRAY(String()), "postgresql")

