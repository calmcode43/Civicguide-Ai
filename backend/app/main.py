from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers import ai
import os

app = FastAPI(title="CivicMind API")

# Include routers
app.include_router(ai.router)

# Configure CORS
origins = os.getenv("ALLOWED_ORIGINS", "http://localhost:3000").split(",")

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def root():
    return {"message": "Welcome to CivicMind API", "status": "active"}

@app.get("/health")
async def health_check():
    return {"status": "healthy"}
