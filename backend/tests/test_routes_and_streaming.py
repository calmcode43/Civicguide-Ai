from __future__ import annotations

import json

from fastapi.testclient import TestClient

from app.main import create_app
from app.models.schemas import TranslatePayload
from app.routers import translate as translate_router
from app.services.session_store import InMemorySessionStore


def make_client(*, raise_server_exceptions: bool = True) -> TestClient:
    return TestClient(create_app(), raise_server_exceptions=raise_server_exceptions)


def parse_sse_events(raw: str) -> list[dict[str, object]]:
    events: list[dict[str, object]] = []
    for frame in raw.strip().split("\n\n"):
        if not frame.startswith("data: "):
            continue
        events.append(json.loads(frame[6:]))
    return events


def test_suggestions_endpoint_accepts_stage_context() -> None:
    with make_client() as client:
        response = client.get(
            "/api/suggestions",
            params={"persona": "First-Time Voter", "stage_context": "Polling Day"},
        )

    assert response.status_code == 200
    payload = response.json()["data"]
    assert payload["stage_context"] == "Polling Day"
    assert len(payload["suggestions"]) >= 1


def test_chat_endpoint_persists_stage_context_in_session() -> None:
    with make_client() as client:
        chat_response = client.post(
            "/api/chat",
            json={
                "message": "What should I verify before polling opens?",
                "user_context": "Candidate",
                "stage_context": "Campaign Period",
                "language": "en",
            },
        )

        session_id = chat_response.json()["data"]["session_id"]
        session_response = client.get(f"/api/sessions/{session_id}")

    assert chat_response.status_code == 200
    assert session_response.status_code == 200
    assert session_response.json()["data"]["session"]["stage_context"] == "Campaign Period"


def test_chat_stream_emits_meta_chunk_and_done_events() -> None:
    with make_client() as client:
        with client.stream(
            "POST",
            "/api/chat/stream",
            json={
                "message": "How do I vote safely?",
                "user_context": "First-Time Voter",
                "stage_context": "Polling Day",
                "language": "en",
            },
        ) as response:
            body = "".join(response.iter_text())

    events = parse_sse_events(body)
    assert response.status_code == 200
    assert response.headers["content-type"].startswith("text/event-stream")
    assert events[0]["type"] == "meta"
    assert events[0]["stage_context"] == "Polling Day"
    assert any(event["type"] == "chunk" for event in events[1:-1])
    assert events[-1]["type"] == "done"
    assert "reply" in events[-1]


def test_global_error_handler_hides_internal_details() -> None:
    app = create_app()

    @app.get("/boom")
    async def boom() -> None:
        raise RuntimeError("secret stack trace")

    with TestClient(app, raise_server_exceptions=False) as client:
        response = client.get("/boom")

    assert response.status_code == 500
    assert response.json()["detail"] == "Internal server error"
    assert "secret stack trace" not in response.text
    assert response.headers["X-Request-ID"].startswith("req_")


def test_feedback_endpoint_saves_feedback() -> None:
    with make_client() as client:
        response = client.post(
            "/api/feedback",
            json={
                "session_id": "session-1",
                "rating": 5,
                "comment": "Helpful answer",
            },
        )
        store = client.app.state.session_store

    assert response.status_code == 200
    assert response.json()["data"]["saved"] is True
    assert isinstance(store, InMemorySessionStore)
    assert len(store.feedback) == 1


def test_translate_route_handles_success_unsupported_language_and_service_failure(
    monkeypatch,
) -> None:
    async def fake_translate(text: str, target_language: str) -> TranslatePayload:
        return TranslatePayload(translated_text=f"{text}-{target_language}", detected_source="en")

    async def failing_translate(text: str, target_language: str) -> TranslatePayload:
        raise RuntimeError("credential leak")

    monkeypatch.setattr(translate_router, "translate_text", fake_translate)
    with make_client() as client:
        success_response = client.post(
            "/api/translate",
            json={"text": "Hello", "target_language": "hi"},
        )
        unsupported_response = client.post(
            "/api/translate",
            json={"text": "Hello", "target_language": "xx"},
        )

    assert success_response.status_code == 200
    assert success_response.json()["data"]["translated_text"] == "Hello-hi"
    assert unsupported_response.status_code == 400

    monkeypatch.setattr(translate_router, "translate_text", failing_translate)
    with make_client() as client:
        failure_response = client.post(
            "/api/translate",
            json={"text": "Hello", "target_language": "hi"},
        )

    assert failure_response.status_code == 503
    assert failure_response.json()["detail"] == "Translation service unavailable"
    assert "credential leak" not in failure_response.text
