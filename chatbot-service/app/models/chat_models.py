"""
Data models for chat functionality
"""

from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field
from datetime import datetime
from enum import Enum


class MessageRole(str, Enum):
    USER = "user"
    ASSISTANT = "assistant"
    SYSTEM = "system"


class ChatMessage(BaseModel):
    role: MessageRole
    content: str
    timestamp: datetime = Field(default_factory=datetime.utcnow)
    metadata: Optional[Dict[str, Any]] = None


class ChatRequest(BaseModel):
    message: str = Field(..., min_length=1, max_length=2000, description="User message")
    conversation_id: Optional[str] = Field(None, description="Conversation ID for context")
    context_type: Optional[str] = Field("general", description="Type of context (placement, faq, general)")
    user_id: Optional[str] = Field(None, description="User identifier")
    
    class Config:
        json_schema_extra = {
            "example": {
                "message": "How should I prepare for system design interviews?",
                "conversation_id": "conv_123456",
                "context_type": "placement",
                "user_id": "user_789"
            }
        }


class ChatResponse(BaseModel):
    message: str
    conversation_id: str
    timestamp: datetime = Field(default_factory=datetime.utcnow)
    context_used: List[str] = Field(default_factory=list)
    confidence_score: Optional[float] = None
    suggested_actions: Optional[List[str]] = None
    
    class Config:
        json_schema_extra = {
            "example": {
                "message": "For system design interviews, focus on scalability, data modeling, and distributed systems...",
                "conversation_id": "conv_123456",
                "timestamp": "2024-01-20T10:30:00Z",
                "context_used": ["placement_preparation", "interview_tips"],
                "confidence_score": 0.85,
                "suggested_actions": ["Practice with mock interviews", "Study system design patterns"]
            }
        }


class ConversationHistory(BaseModel):
    conversation_id: str
    messages: List[ChatMessage]
    created_at: datetime
    updated_at: datetime
    user_id: Optional[str] = None
    context_type: str = "general"


class ContextManagementRequest(BaseModel):
    context_type: str = Field(..., description="Type of context to set")
    context_data: Dict[str, Any] = Field(..., description="Context data")
    
    class Config:
        json_schema_extra = {
            "example": {
                "context_type": "placement_preparation",
                "context_data": {
                    "company": "Google",
                    "role": "Software Engineer",
                    "difficulty_level": "intermediate"
                }
            }
        }


class ContextManagementResponse(BaseModel):
    status: str
    context_id: str
    message: str


class HealthCheck(BaseModel):
    status: str
    timestamp: datetime = Field(default_factory=datetime.utcnow)
    service: str = "chatbot-api"
    version: str = "1.0.0"
    cohere_status: str = "unknown"