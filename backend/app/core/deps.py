from __future__ import annotations

from collections.abc import Callable
from typing import Annotated

from fastapi import Cookie, Depends, Header, HTTPException, Request, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.core.db import get_db_session
from app.core.rate_limit import enforce_rate_limit
from app.core.security import decode_token
from app.modules.auth.models import User, UserRole
from app.shared.utils.permissions import has_permission


SessionDep = Annotated[AsyncSession, Depends(get_db_session)]


async def rate_limited(request: Request) -> None:
    enforce_rate_limit(request)


async def get_current_user(
    session: SessionDep,
    authorization: Annotated[str | None, Header()] = None,
) -> User:
    if not authorization or not authorization.lower().startswith("bearer "):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Missing bearer token")
    token = authorization.split(" ", 1)[1]
    try:
        payload = decode_token(token)
    except Exception as exc:  # pragma: no cover - library specific
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token") from exc

    statement = (
        select(User)
        .where(User.id == payload["sub"], User.org_id == payload["org_id"])
        .options(
            selectinload(User.organization),
            selectinload(User.role_assignments).selectinload(UserRole.role),
        )
    )
    user = await session.scalar(statement)
    if not user or not user.is_active:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="User not found")
    return user


CurrentUser = Annotated[User, Depends(get_current_user)]


def require_permission(permission: str) -> Callable[[CurrentUser], User]:
    async def dependency(user: CurrentUser) -> User:
        if not has_permission(user.effective_permissions, permission):
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Forbidden")
        return user

    return dependency
