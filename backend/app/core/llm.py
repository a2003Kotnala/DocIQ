"""
LLM abstraction layer for DocIQ.

Strategy:
  1. Primary: Free models via OpenRouter (google/gemma-3-27b-it:free or similar)
  2. Fallback: Google Gemini API (if GEMINI_API_KEY is set)

No OpenAI dependency.
"""
from __future__ import annotations

import logging
from typing import Any

import httpx
from tenacity import retry, stop_after_attempt, wait_exponential

from app.core.settings import get_settings

logger = logging.getLogger(__name__)


# ---------------------------------------------------------------------------
# Low-level HTTP helpers
# ---------------------------------------------------------------------------

@retry(stop=stop_after_attempt(2), wait=wait_exponential(multiplier=1, min=1, max=4))
async def _call_openrouter(prompt: str, system: str = "") -> str:
    """Call OpenRouter free-tier endpoint (no API key needed for free models)."""
    settings = get_settings()
    messages: list[dict[str, str]] = []
    if system:
        messages.append({"role": "system", "content": system})
    messages.append({"role": "user", "content": prompt})

    payload: dict[str, Any] = {
        "model": settings.free_llm_model,
        "messages": messages,
        "max_tokens": 1024,
        "temperature": 0.2,
    }

    async with httpx.AsyncClient(timeout=30) as client:
        response = await client.post(
            f"{settings.free_llm_base_url}/chat/completions",
            json=payload,
            headers={"Content-Type": "application/json"},
        )
        response.raise_for_status()
        data = response.json()
        return data["choices"][0]["message"]["content"]


@retry(stop=stop_after_attempt(2), wait=wait_exponential(multiplier=1, min=1, max=4))
async def _call_gemini(prompt: str, system: str = "") -> str:
    """Call Gemini API as fallback when GEMINI_API_KEY is available."""
    settings = get_settings()
    if not settings.gemini_api_key:
        raise RuntimeError("GEMINI_API_KEY is not set — cannot use Gemini fallback.")

    api_key = settings.gemini_api_key.get_secret_value()
    model = settings.gemini_model

    full_prompt = f"{system}\n\n{prompt}" if system else prompt
    payload = {
        "contents": [{"parts": [{"text": full_prompt}]}],
        "generationConfig": {"maxOutputTokens": 1024, "temperature": 0.2},
    }

    url = (
        f"https://generativelanguage.googleapis.com/v1beta/models/"
        f"{model}:generateContent?key={api_key}"
    )

    async with httpx.AsyncClient(timeout=30) as client:
        response = await client.post(url, json=payload)
        response.raise_for_status()
        data = response.json()
        return data["candidates"][0]["content"]["parts"][0]["text"]


# ---------------------------------------------------------------------------
# Public interface
# ---------------------------------------------------------------------------

async def generate_text(prompt: str, system: str = "") -> str:
    """
    Generate text using the best available model.

    Try free-tier first; if that fails (or no base URL configured), fall back
    to Gemini API. Raises RuntimeError if both fail.
    """
    settings = get_settings()

    # Try free/self-hosted model first
    try:
        if settings.free_llm_base_url:
            result = await _call_openrouter(prompt, system)
            logger.debug("LLM answered via free-tier model (%s)", settings.free_llm_model)
            return result
    except Exception as primary_error:  # noqa: BLE001
        logger.warning("Free-tier LLM failed: %s — trying Gemini fallback", primary_error)

    # Gemini fallback
    if settings.gemini_api_key:
        try:
            result = await _call_gemini(prompt, system)
            logger.debug("LLM answered via Gemini fallback (%s)", settings.gemini_model)
            return result
        except Exception as fallback_error:  # noqa: BLE001
            logger.error("Gemini fallback also failed: %s", fallback_error)
            raise RuntimeError(
                "Both primary and Gemini fallback LLM calls failed."
            ) from fallback_error

    raise RuntimeError(
        "No LLM available: free-tier call failed and GEMINI_API_KEY is not set."
    )


async def embed_text(text: str) -> list[float]:
    """
    Embed a single text chunk using Gemini embedding API.
    Falls back to a zero-vector if no API key is set (for dev environments).
    """
    settings = get_settings()

    if settings.gemini_api_key:
        api_key = settings.gemini_api_key.get_secret_value()
        model = settings.gemini_embedding_model
        url = (
            f"https://generativelanguage.googleapis.com/v1beta/"
            f"{model}:embedContent?key={api_key}"
        )
        payload = {
            "model": model,
            "content": {"parts": [{"text": text}]},
        }
        async with httpx.AsyncClient(timeout=20) as client:
            response = await client.post(url, json=payload)
            response.raise_for_status()
            data = response.json()
            return data["embedding"]["values"]

    # Dev fallback — 768-dim zero vector (matches Gemini embedding dimension)
    logger.warning("No GEMINI_API_KEY set; returning zero-vector embedding.")
    return [0.0] * 768
