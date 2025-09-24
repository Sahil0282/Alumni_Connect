"""
Conversation storage utilities
In-memory storage for now, can be replaced with Redis or database
"""

from typing import Dict, List, Optional
from datetime import datetime, timedelta
from app.models.chat_models import ConversationHistory, ChatMessage


class ConversationStorage:
    """In-memory conversation storage"""
    
    def __init__(self):
        self.conversations: Dict[str, ConversationHistory] = {}
    
    def save_conversation(
        self,
        conversation_id: str,
        messages: List[ChatMessage],
        user_id: Optional[str] = None,
        context_type: str = "general"
    ) -> bool:
        """
        Save or update a conversation
        
        Args:
            conversation_id: Unique conversation identifier
            messages: List of chat messages
            user_id: Optional user identifier
            context_type: Type of conversation context
            
        Returns:
            True if saved successfully
        """
        try:
            current_time = datetime.utcnow()
            
            if conversation_id in self.conversations:
                # Update existing conversation
                conversation = self.conversations[conversation_id]
                conversation.messages = messages
                conversation.updated_at = current_time
            else:
                # Create new conversation
                conversation = ConversationHistory(
                    conversation_id=conversation_id,
                    messages=messages,
                    created_at=current_time,
                    updated_at=current_time,
                    user_id=user_id,
                    context_type=context_type
                )
                self.conversations[conversation_id] = conversation
            
            return True
        except Exception:
            return False
    
    def get_conversation(self, conversation_id: str) -> Optional[ConversationHistory]:
        """
        Get conversation by ID
        
        Args:
            conversation_id: Conversation identifier
            
        Returns:
            ConversationHistory object or None if not found
        """
        return self.conversations.get(conversation_id)
    
    def delete_conversation(self, conversation_id: str) -> bool:
        """
        Delete a conversation
        
        Args:
            conversation_id: Conversation identifier
            
        Returns:
            True if deleted, False if not found
        """
        if conversation_id in self.conversations:
            del self.conversations[conversation_id]
            return True
        return False
    
    def get_user_conversations(self, user_id: str) -> List[ConversationHistory]:
        """
        Get all conversations for a user
        
        Args:
            user_id: User identifier
            
        Returns:
            List of user's conversations
        """
        return [
            conv for conv in self.conversations.values()
            if conv.user_id == user_id
        ]
    
    def cleanup_old_conversations(self, max_age_hours: int = 72):
        """
        Remove conversations older than specified hours
        
        Args:
            max_age_hours: Maximum age in hours
        """
        cutoff_time = datetime.utcnow() - timedelta(hours=max_age_hours)
        
        expired_ids = [
            conv_id for conv_id, conv in self.conversations.items()
            if conv.updated_at < cutoff_time
        ]
        
        for conv_id in expired_ids:
            del self.conversations[conv_id]
    
    def get_conversation_count(self) -> int:
        """Get total number of conversations"""
        return len(self.conversations)
    
    def get_active_conversations_count(self, hours: int = 24) -> int:
        """Get number of conversations active within specified hours"""
        cutoff_time = datetime.utcnow() - timedelta(hours=hours)
        
        return len([
            conv for conv in self.conversations.values()
            if conv.updated_at >= cutoff_time
        ])