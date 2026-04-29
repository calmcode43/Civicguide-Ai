from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from app.services.gemini_service import gemini_service

router = APIRouter(prefix="/ai", tags=["AI"])

class QueryRequest(BaseModel):
    prompt: str

@router.post("/chat")
async def chat(request: QueryRequest):
    if not request.prompt:
        raise HTTPException(status_code=400, detail="Prompt cannot be empty")
    
    response = await gemini_service.generate_response(request.prompt)
    return {"response": response}
