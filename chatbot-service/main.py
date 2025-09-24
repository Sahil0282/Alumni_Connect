"""
FastAPI Chatbot Service for Alumni Connect Platform
Integrates with Cohere LLM for student portal assistance
"""

import os
import uvicorn
from fastapi import FastAPI, HTTPException, Depends, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from contextlib import asynccontextmanager
from dotenv import load_dotenv

from app.routers import chat, health
from app.core.config import settings
from app.core.rate_limiter import RateLimiter
from app.services.cohere_service import CohereService
from app.middleware.error_handler import ErrorHandlerMiddleware

# Load environment variables
load_dotenv()

# Initialize rate limiter
rate_limiter = RateLimiter()

@asynccontextmanager
async def lifespan(app: FastAPI):
    """Startup and shutdown events"""
    # Startup
    print("🚀 Starting Alumni Connect Chatbot Service...")
    
    # Initialize Cohere service
    cohere_service = CohereService()
    app.state.cohere_service = cohere_service
    
    # Initialize rate limiter
    app.state.rate_limiter = rate_limiter
    
    print("✅ Chatbot service initialized successfully")
    
    yield
    
    # Shutdown
    print("🛑 Shutting down chatbot service...")

# Create FastAPI application
app = FastAPI(
    title="Alumni Connect Chatbot API",
    description="AI-powered chatbot for student portal assistance with placement preparation and FAQ handling",
    version="1.0.0",
    docs_url="/docs" if settings.DEBUG else None,
    redoc_url="/redoc" if settings.DEBUG else None,
    lifespan=lifespan
)

# Add error handling middleware
app.add_middleware(ErrorHandlerMiddleware)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE"],
    allow_headers=["*"],
)

# Include routers
app.include_router(health.router, prefix="/api", tags=["health"])
app.include_router(chat.router, prefix="/api/chat", tags=["chat"])

# Root endpoint
@app.get("/")
async def root():
    return {
        "service": "Alumni Connect Chatbot API",
        "version": "1.0.0",
        "status": "running",
        "docs": "/docs" if settings.DEBUG else "disabled in production"
    }

if __name__ == "__main__":
    uvicorn.run(
        "main:app",
        host=settings.HOST,
        port=settings.PORT,
        reload=settings.DEBUG,
        log_level="info" if settings.DEBUG else "warning"
    )