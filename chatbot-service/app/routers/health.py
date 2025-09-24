"""
Health check endpoints
"""

from fastapi import APIRouter, Depends, Request
from app.models.chat_models import HealthCheck
from app.services.cohere_service import CohereService

router = APIRouter()


@router.get("/health", response_model=HealthCheck)
async def health_check(request: Request):
    """Health check endpoint"""
    
    # Get Cohere service from app state
    cohere_service: CohereService = request.app.state.cohere_service
    
    # Check Cohere service health
    cohere_health = await cohere_service.health_check()
    
    return HealthCheck(
        status="healthy" if cohere_health["status"] == "healthy" else "degraded",
        cohere_status=cohere_health["status"]
    )