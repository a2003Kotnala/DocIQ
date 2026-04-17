from __future__ import annotations

from fastapi import APIRouter, Cookie, Depends, HTTPException, Response, status

from app.core.deps import CurrentUser, SessionDep, rate_limited
from app.modules.auth.schemas import AuthResponse, LoginRequest, RefreshResponse
from app.modules.auth.schemas import OrganizationCreate as RegisterRequest
from app.modules.auth.service import authenticate, logout, refresh_session, register_organization

router = APIRouter(prefix="/auth", tags=["auth"])


@router.post("/register", response_model=AuthResponse, dependencies=[Depends(rate_limited)])
async def register(payload: RegisterRequest, session: SessionDep, response: Response) -> AuthResponse:
    result = await register_organization(session, payload)
    response.set_cookie("refresh_token", result.refresh_token, httponly=True, samesite="lax")
    return result


@router.post("/login", response_model=AuthResponse, dependencies=[Depends(rate_limited)])
async def login(payload: LoginRequest, session: SessionDep, response: Response) -> AuthResponse:
    result = await authenticate(session, payload)
    response.set_cookie("refresh_token", result.refresh_token, httponly=True, samesite="lax")
    return result


@router.post("/refresh", response_model=RefreshResponse)
async def refresh_token(
    session: SessionDep,
    refresh_token: str | None = Cookie(default=None),
) -> RefreshResponse:
    if not refresh_token:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Missing refresh token")
    return RefreshResponse(access_token=await refresh_session(session, refresh_token))


@router.post("/logout", status_code=status.HTTP_204_NO_CONTENT)
async def logout_route(
    session: SessionDep,
    response: Response,
    refresh_token: str | None = Cookie(default=None),
) -> Response:
    if refresh_token:
        await logout(session, refresh_token)
    response.delete_cookie("refresh_token")
    return response


@router.get("/me")
async def me(user: CurrentUser) -> dict:
    return {
        "id": user.id,
        "org_id": user.org_id,
        "email": user.email,
        "display_name": user.display_name,
        "permissions": user.effective_permissions,
    }
