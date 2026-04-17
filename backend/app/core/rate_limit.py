from __future__ import annotations

from fastapi import HTTPException, Request, status
from redis import Redis

from app.core.settings import get_settings


def enforce_rate_limit(request: Request) -> None:
    settings = get_settings()
    client = Redis.from_url(settings.redis_url, decode_responses=True)
    key = f"ratelimit:{request.client.host if request.client else 'unknown'}"
    current = client.incr(key)
    if current == 1:
        client.expire(key, 60)
    if current > settings.rate_limit_per_minute:
        raise HTTPException(status_code=status.HTTP_429_TOO_MANY_REQUESTS, detail="Rate limit exceeded")

