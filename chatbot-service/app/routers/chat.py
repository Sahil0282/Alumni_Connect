"""
Chat endpoints for the chatbot API
"""

import uuid
from typing import List, Optional
from fastapi import APIRouter, HTTPException, Depends, Request
from slowapi import Limiter
from slowapi.util import get_remote_address

from app.models.chat_models import (
    ChatRequest, 
    ChatResponse, 
    ConversationHistory,
    ContextManagementRequest,
    ContextManagementResponse,
    ChatMessage,
    MessageRole
)
from app.services.cohere_service import CohereService
from app.core.rate_limiter import get_client_ip, limiter
from app.utils.context_manager import ContextManager
from app.utils.conversation_storage import ConversationStorage

router = APIRouter()


@router.post("/complete", response_model=ChatResponse)
@limiter.limit("30/minute")
async def chat_completion(
    request: Request,
    chat_request: ChatRequest
):
    """
    Generate chat completion using Cohere LLM
    """
    try:
        # Get services from app state
        cohere_service: CohereService = request.app.state.cohere_service
        
        # Initialize conversation storage (in-memory for now)
        storage = ConversationStorage()
        
        # Get or create conversation ID
        conversation_id = chat_request.conversation_id or str(uuid.uuid4())
        
        # Get conversation history
        conversation_history = storage.get_conversation(conversation_id)
        chat_messages = conversation_history.messages if conversation_history else []
        
        # Add user message to history
        user_message = ChatMessage(
            role=MessageRole.USER,
            content=chat_request.message,
            metadata={"user_id": chat_request.user_id}
        )
        chat_messages.append(user_message)
        
        # Generate response using Cohere
        response_data = await cohere_service.generate_response(
            message=chat_request.message,
            conversation_history=chat_messages,
            context_type=chat_request.context_type or "general"
        )
        
        # Create assistant message
        assistant_message = ChatMessage(
            role=MessageRole.ASSISTANT,
            content=response_data["response"],
            metadata={
                "confidence": response_data.get("confidence"),
                "context_used": response_data.get("context_used", [])
            }
        )
        chat_messages.append(assistant_message)
        
        # Save updated conversation
        storage.save_conversation(
            conversation_id=conversation_id,
            messages=chat_messages,
            user_id=chat_request.user_id,
            context_type=chat_request.context_type or "general"
        )
        
        # Return response
        return ChatResponse(
            message=response_data["response"],
            conversation_id=conversation_id,
            context_used=response_data.get("context_used", []),
            confidence_score=response_data.get("confidence"),
            suggested_actions=response_data.get("suggested_actions")
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error generating response: {str(e)}")


@router.get("/history/{conversation_id}", response_model=ConversationHistory)
@limiter.limit("60/minute")
async def get_conversation_history(
    request: Request,
    conversation_id: str,
    limit: Optional[int] = 50
):
    """
    Get conversation history for a specific conversation
    """
    try:
        storage = ConversationStorage()
        conversation = storage.get_conversation(conversation_id)
        
        if not conversation:
            raise HTTPException(status_code=404, detail="Conversation not found")
        
        # Limit the number of messages returned
        if limit and len(conversation.messages) > limit:
            conversation.messages = conversation.messages[-limit:]
        
        return conversation
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error retrieving conversation: {str(e)}")


@router.delete("/history/{conversation_id}")
@limiter.limit("10/minute")
async def delete_conversation(
    request: Request,
    conversation_id: str
):
    """
    Delete a conversation history
    """
    try:
        storage = ConversationStorage()
        if storage.delete_conversation(conversation_id):
            return {"message": "Conversation deleted successfully"}
        else:
            raise HTTPException(status_code=404, detail="Conversation not found")
            
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error deleting conversation: {str(e)}")


@router.post("/context", response_model=ContextManagementResponse)
@limiter.limit("20/minute")
async def manage_context(
    request: Request,
    context_request: ContextManagementRequest
):
    """
    Manage context for better chatbot responses
    """
    try:
        context_manager = ContextManager()
        context_id = context_manager.set_context(
            context_type=context_request.context_type,
            context_data=context_request.context_data
        )
        
        return ContextManagementResponse(
            status="success",
            context_id=context_id,
            message=f"Context '{context_request.context_type}' set successfully"
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error managing context: {str(e)}")


@router.get("/contexts")
@limiter.limit("30/minute")
async def list_available_contexts(request: Request):
    """
    List available context types
    """
    return {
        "contexts": [
            {
                "type": "general",
                "description": "General alumni platform assistance"
            },
            {
                "type": "placement",
                "description": "Placement preparation and career guidance"
            },
            {
                "type": "faq",
                "description": "Frequently asked questions about the platform"
            }
        ]
    }