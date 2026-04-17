from __future__ import annotations

from datetime import datetime

from pydantic import BaseModel, ConfigDict, EmailStr, Field


class AuthUser(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    org_id: str
    email: EmailStr
    display_name: str | None = None
    is_active: bool


class OrganizationCreate(BaseModel):
    org_name: str = Field(min_length=2, max_length=255)
    email: EmailStr
    password: str = Field(min_length=8, max_length=128)
    plan_tier: str = "starter"


class LoginRequest(BaseModel):
    email: EmailStr
    password: str
    org_slug: str | None = None


class AuthTokens(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = "bearer"


class AuthResponse(BaseModel):
    user: AuthUser
    organization: dict[str, str]
    access_token: str
    refresh_token: str


class RefreshResponse(BaseModel):
    access_token: str


class RoleResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    name: str
    description: str | None = None
    permissions: list[str]

