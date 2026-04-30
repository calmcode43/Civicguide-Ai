from __future__ import annotations

import pytest

from app.services import translate_service


class FakeTranslateClient:
    def __init__(self) -> None:
        self.calls: list[tuple[str, str]] = []

    def translate(self, text: str, target_language: str) -> dict[str, str]:
        self.calls.append((text, target_language))
        return {
            "translatedText": f"{text}-{target_language}",
            "detectedSourceLanguage": "en",
        }


@pytest.mark.asyncio
async def test_translation_cache_is_bounded(monkeypatch: pytest.MonkeyPatch) -> None:
    fake_client = FakeTranslateClient()
    translate_service._cache.clear()
    monkeypatch.setattr(translate_service, "_client", fake_client)
    monkeypatch.setattr(translate_service, "MAX_TRANSLATION_CACHE_ITEMS", 2)

    await translate_service.translate_text("one", "hi")
    await translate_service.translate_text("two", "hi")
    await translate_service.translate_text("three", "hi")
    await translate_service.translate_text("three", "hi")

    assert len(translate_service._cache) == 2
    assert ("one", "hi") not in translate_service._cache
    assert ("two", "hi") in translate_service._cache
    assert ("three", "hi") in translate_service._cache
    assert fake_client.calls == [("one", "hi"), ("two", "hi"), ("three", "hi")]
