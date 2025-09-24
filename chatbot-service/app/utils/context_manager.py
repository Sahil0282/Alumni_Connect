"""
Context management utilities
"""

import uuid
from typing import Dict, Any, Optional
from datetime import datetime, timedelta


class ContextManager:
    """Manages context for better chatbot responses"""
    
    def __init__(self):
        self.contexts: Dict[str, Dict[str, Any]] = {}
    
    def set_context(self, context_type: str, context_data: Dict[str, Any]) -> str:
        """
        Set context data for a conversation
        
        Args:
            context_type: Type of context (placement, faq, general)
            context_data: Context data dictionary
            
        Returns:
            Context ID
        """
        context_id = str(uuid.uuid4())
        
        self.contexts[context_id] = {
            "type": context_type,
            "data": context_data,
            "created_at": datetime.utcnow(),
            "expires_at": datetime.utcnow() + timedelta(hours=24)
        }
        
        return context_id
    
    def get_context(self, context_id: str) -> Optional[Dict[str, Any]]:
        """
        Get context data by ID
        
        Args:
            context_id: Context identifier
            
        Returns:
            Context data or None if not found/expired
        """
        if context_id not in self.contexts:
            return None
        
        context = self.contexts[context_id]
        
        # Check if context has expired
        if datetime.utcnow() > context["expires_at"]:
            del self.contexts[context_id]
            return None
        
        return context
    
    def update_context(self, context_id: str, context_data: Dict[str, Any]) -> bool:
        """
        Update existing context data
        
        Args:
            context_id: Context identifier
            context_data: New context data
            
        Returns:
            True if updated successfully, False if not found
        """
        if context_id not in self.contexts:
            return False
        
        context = self.contexts[context_id]
        
        # Check if context has expired
        if datetime.utcnow() > context["expires_at"]:
            del self.contexts[context_id]
            return False
        
        # Update data and extend expiration
        context["data"].update(context_data)
        context["expires_at"] = datetime.utcnow() + timedelta(hours=24)
        
        return True
    
    def delete_context(self, context_id: str) -> bool:
        """
        Delete context data
        
        Args:
            context_id: Context identifier
            
        Returns:
            True if deleted, False if not found
        """
        if context_id in self.contexts:
            del self.contexts[context_id]
            return True
        return False
    
    def cleanup_expired_contexts(self):
        """Remove expired contexts"""
        current_time = datetime.utcnow()
        expired_ids = [
            context_id for context_id, context in self.contexts.items()
            if current_time > context["expires_at"]
        ]
        
        for context_id in expired_ids:
            del self.contexts[context_id]