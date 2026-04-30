from __future__ import annotations

import asyncio
from collections import OrderedDict
from typing import Dict, Tuple

from google.cloud import translate_v2 as translate_v2

from app.models.schemas import TranslatePayload

SUPPORTED_LANGUAGES: Dict[str, str] = {
    "en": "English",
    "hi": "Hindi",
    "pa": "Punjabi",
    "ta": "Tamil",
    "te": "Telugu",
    "bn": "Bengali",
}

_client: translate_v2.Client | None = None
_cache: "OrderedDict[Tuple[str, str], TranslatePayload]" = OrderedDict()
MAX_TRANSLATION_CACHE_ITEMS = 128


def _get_client() -> translate_v2.Client:
    global _client
    if _client is None:
        _client = translate_v2.Client()
    return _client


def is_translate_ready() -> bool:
    try:
        _get_client()
        return True
    except Exception:
        return False


def _cache_put(key: Tuple[str, str], payload: TranslatePayload) -> None:
    if key in _cache:
        _cache.move_to_end(key)
    _cache[key] = payload
    while len(_cache) > MAX_TRANSLATION_CACHE_ITEMS:
        _cache.popitem(last=False)


async def translate_text(text: str, target_language: str) -> TranslatePayload:
    if target_language not in SUPPORTED_LANGUAGES:
        raise ValueError(f"Unsupported language: {target_language}")

    key = (text, target_language)
    if key in _cache:
        _cache.move_to_end(key)
        return _cache[key]

    client = _get_client()

    def _sync_translate() -> TranslatePayload:
        result = client.translate(text, target_language=target_language)
        translated = result.get("translatedText", "")
        detected = (
            result.get("detectedSourceLanguage", "")
            or result.get("sourceLanguage", "")
            or "unknown"
        )
        return TranslatePayload(
            translated_text=translated,
            detected_source=detected,
        )

    response = await asyncio.to_thread(_sync_translate)
    _cache_put(key, response)
    return response
