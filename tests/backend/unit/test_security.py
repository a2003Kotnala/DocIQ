from app.core.security import create_access_token, decode_token, hash_password, verify_password


def test_password_hash_round_trip() -> None:
    password = "StrongPass123!"
    password_hash = hash_password(password)
    assert verify_password(password, password_hash)


def test_access_token_contains_subject() -> None:
    token = create_access_token("user-1", {"org_id": "org-1", "roles": ["ORG_ADMIN"]})
    payload = decode_token(token)
    assert payload["sub"] == "user-1"
    assert payload["org_id"] == "org-1"

