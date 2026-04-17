from __future__ import annotations

from app.shared.models.enums import RoleName


SYSTEM_ROLE_PERMISSIONS: dict[str, list[str]] = {
    RoleName.ORG_ADMIN: ["*"],
    RoleName.MANAGER: ["document.*", "workflow.read", "analytics.read", "feedback.write"],
    RoleName.ANALYST: ["document.read", "document.create", "search.execute", "feedback.write"],
    RoleName.REVIEWER: ["document.read", "document.review", "document.approve"],
    RoleName.VIEWER: ["document.read", "search.execute"],
    RoleName.API_USER: [],
}


def has_permission(permissions: list[str], required: str) -> bool:
    if "*" in permissions:
        return True
    if required in permissions:
        return True
    resource_prefix = f"{required.split('.')[0]}.*"
    return resource_prefix in permissions

