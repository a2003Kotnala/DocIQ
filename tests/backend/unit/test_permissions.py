from app.shared.utils.permissions import has_permission


def test_permission_wildcard_matches() -> None:
    assert has_permission(["document.*"], "document.read")


def test_permission_rejects_missing_scope() -> None:
    assert not has_permission(["document.read"], "workflow.manage")

