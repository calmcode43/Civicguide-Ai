from __future__ import annotations

from typing import Literal

from pydantic import BaseModel, Field


class ChatRequest(BaseModel):
    session_id: str | None = None
    message: str = Field(..., min_length=1, max_length=2000)
    language: Literal["en", "hi"] = "en"


class ChatResponse(BaseModel):
    session_id: str
    reply: str
    sources: list[str] = []


class ElectionStep(BaseModel):
    id: str
    phase: str
    title: str
    description: str
    duration: str
    order: int
    details: list[str]


class ElectionPhase(BaseModel):
    id: str
    name: str
    color: str
    steps: list[ElectionStep]


class ElectionTimelineResponse(BaseModel):
    phases: list[ElectionPhase]
    total_steps: int


class ApiResponse(BaseModel):
    data: ElectionTimelineResponse
    status: str = "success"
    error: str | None = None


class TranslateRequest(BaseModel):
    text: str
    target_language: str


class TranslateResponse(BaseModel):
    translated_text: str
    detected_source: str


class TimelineEvent(BaseModel):
    id: str
    title: str
    description: str
    phase: str
    order: int
    icon: str
    typical_duration_days: int

