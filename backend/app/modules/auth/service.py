from __future__ import annotations

import hashlib
from datetime import datetime, timedelta, timezone
from uuid import uuid4

from sqlalchemy import select
from sqlalchemy.orm import selectinload
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.audit import write_audit_log
from app.core.http import conflict, not_found
from app.core.security import (
    create_access_token,
    create_refresh_token,
    decode_token,
    hash_password,
    verify_password,
)
from app.modules.auth.models import Organization, RefreshToken, Role, User, UserRole
from app.modules.auth.schemas import AuthResponse, LoginRequest, OrganizationCreate
from app.shared.models.enums import RoleName
from app.shared.utils.permissions import SYSTEM_ROLE_PERMISSIONS
from app.shared.utils.text import slugify


def hash_refresh_token(token: str) -> str:
    return hashlib.sha256(token.encode("utf-8")).hexdigest()


async def ensure_system_roles(session: AsyncSession, *, org_id: str) -> list[Role]:
    roles: list[Role] = []
    for role_name, permissions in SYSTEM_ROLE_PERMISSIONS.items():
        result = await session.scalar(select(Role).where(Role.org_id == org_id, Role.name == role_name))
        if result:
            roles.append(result)
            continue
        role = Role(
            org_id=org_id,
            name=role_name,
            description=f"System role {role_name}",
            is_system_role=True,
            permissions=permissions,
        )
        session.add(role)
        roles.append(role)
    await session.flush()
    return roles


async def register_organization(session: AsyncSession, payload: OrganizationCreate) -> AuthResponse:
    slug = slugify(payload.org_name)
    existing = await session.scalar(select(Organization).where(Organization.slug == slug))
    if existing:
        raise conflict("Organization slug already exists")

    organization = Organization(name=payload.org_name, slug=slug, plan_tier=payload.plan_tier)
    session.add(organization)
    await session.flush()

    roles = await ensure_system_roles(session, org_id=organization.id)
    admin_role = next(role for role in roles if role.name == RoleName.ORG_ADMIN)

    user = User(
        org_id=organization.id,
        email=payload.email,
        hashed_password=hash_password(payload.password),
        display_name=payload.email.split("@")[0],
    )
    session.add(user)
    await session.flush()
    session.add(UserRole(user_id=user.id, role_id=admin_role.id, assigned_by=user.id))

    access_token = create_access_token(
        subject=user.id,
        claims={"org_id": organization.id, "roles": [admin_role.name]},
    )
    refresh_token = create_refresh_token(
        subject=user.id,
        claims={"org_id": organization.id, "roles": [admin_role.name], "family_id": str(uuid4())},
    )
    refresh_record = RefreshToken(
        user_id=user.id,
        org_id=organization.id,
        token_hash=hash_refresh_token(refresh_token),
        family_id=decode_token(refresh_token)["family_id"],
        expires_at=datetime.now(timezone.utc) + timedelta(days=7),
    )
    session.add(refresh_record)

    await write_audit_log(
        session,
        org_id=organization.id,
        user_id=user.id,
        action="auth.register",
        resource_type="organization",
        resource_id=organization.id,
        after_state={"email": user.email, "org_slug": organization.slug},
    )
    await session.commit()
    await session.refresh(user)
    return AuthResponse(
        user=user,
        organization={"id": organization.id, "name": organization.name, "slug": organization.slug},
        access_token=access_token,
        refresh_token=refresh_token,
    )


async def authenticate(session: AsyncSession, payload: LoginRequest) -> AuthResponse:
    statement = (
        select(User)
        .where(User.email == payload.email)
        .options(
            selectinload(User.organization),
            selectinload(User.role_assignments).selectinload(UserRole.role),
        )
        .order_by(User.created_at.desc())
    )
    users = (await session.scalars(statement)).unique().all()
    if payload.org_slug:
        users = [user for user in users if user.organization.slug == payload.org_slug]  # type: ignore[union-attr]
    if not users:
        raise not_found("Invalid credentials")
    user = users[0]
    if not user.hashed_password or not verify_password(payload.password, user.hashed_password):
        raise not_found("Invalid credentials")
    user.last_login_at = datetime.now(timezone.utc)

    roles = [assignment.role.name for assignment in user.role_assignments]
    access_token = create_access_token(subject=user.id, claims={"org_id": user.org_id, "roles": roles})
    family_id = str(uuid4())
    refresh_token = create_refresh_token(
        subject=user.id,
        claims={"org_id": user.org_id, "roles": roles, "family_id": family_id},
    )
    session.add(
        RefreshToken(
            user_id=user.id,
            org_id=user.org_id,
            token_hash=hash_refresh_token(refresh_token),
            family_id=family_id,
            expires_at=datetime.now(timezone.utc) + timedelta(days=7),
        )
    )
    await session.commit()
    await session.refresh(user)
    return AuthResponse(
        user=user,
        organization={"id": user.organization.id, "name": user.organization.name, "slug": user.organization.slug},
        access_token=access_token,
        refresh_token=refresh_token,
    )


async def refresh_session(session: AsyncSession, refresh_token: str) -> str:
    payload = decode_token(refresh_token)
    token_hash = hash_refresh_token(refresh_token)
    record = await session.scalar(
        select(RefreshToken).where(
            RefreshToken.user_id == payload["sub"],
            RefreshToken.token_hash == token_hash,
            RefreshToken.revoked_at.is_(None),
        )
    )
    if not record:
        raise not_found("Refresh token not found")
    record.revoked_at = datetime.now(timezone.utc)
    user = await session.scalar(
        select(User)
        .where(User.id == payload["sub"])
        .options(selectinload(User.role_assignments).selectinload(UserRole.role))
    )
    if not user:
        raise not_found("User not found")
    access_token = create_access_token(
        subject=user.id,
        claims={"org_id": user.org_id, "roles": [assignment.role.name for assignment in user.role_assignments]},
    )
    await session.commit()
    return access_token


async def logout(session: AsyncSession, refresh_token: str) -> None:
    token_hash = hash_refresh_token(refresh_token)
    record = await session.scalar(select(RefreshToken).where(RefreshToken.token_hash == token_hash))
    if record:
        record.revoked_at = datetime.now(timezone.utc)
        await session.commit()
