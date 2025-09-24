"""
Cohere LLM Integration Service
"""

import cohere
from typing import List, Dict, Any, Optional
from app.core.config import settings
from app.models.chat_models import ChatMessage, MessageRole
import logging

logger = logging.getLogger(__name__)


class CohereService:
    """Service for interacting with Cohere LLM API"""
    
    def __init__(self):
        if not settings.COHERE_API_KEY:
            logger.warning("COHERE_API_KEY not set - service will not function properly")
            self.client = None
        else:
            self.client = cohere.Client(settings.COHERE_API_KEY)
        
        # Context templates for different types of queries
        self.context_templates = {
            "placement": self._get_placement_context(),
            "faq": self._get_faq_context(),
            "general": self._get_general_context()
        }
    
    def _get_placement_context(self) -> str:
        """Context for placement preparation queries"""
        return """You are an AI assistant helping students with placement preparation for tech companies. 
        You have expertise in:
        - Technical interview preparation (DSA, System Design, Coding)
        - Resume building and optimization
        - Company-specific preparation strategies
        - Behavioral interview tips
        - Mock interview guidance
        - Salary negotiation
        - Career advice for freshers
        
        Provide detailed, actionable advice. Include specific resources, practice problems, or study plans when relevant.
        Keep responses focused on placement preparation and career guidance."""
    
    def _get_faq_context(self) -> str:
        """Context for FAQ handling"""
        return """You are an AI assistant for the Alumni Connect platform, helping students with frequently asked questions about:
        - Platform navigation and features
        - Alumni networking and mentorship
        - Event information and registration
        - Profile management
        - Messaging and communication
        - Forum participation
        - Job opportunities and referrals
        
        Provide clear, concise answers. Direct users to specific platform features when relevant.
        Be helpful and encouraging in your responses."""
    
    def _get_general_context(self) -> str:
        """General context for alumni platform assistance"""
        return """You are an AI assistant for the Alumni Connect platform. You help students and alumni with:
        - Networking and mentorship opportunities
        - Career guidance and advice
        - Platform features and navigation
        - Event information
        - General academic and professional questions
        
        Be supportive, professional, and helpful. Encourage users to connect with alumni and participate in the community."""
    
    async def generate_response(
        self,
        message: str,
        conversation_history: List[ChatMessage] = None,
        context_type: str = "general",
        max_tokens: int = None
    ) -> Dict[str, Any]:
        """
        Generate a response using Cohere LLM
        
        Args:
            message: User message
            conversation_history: Previous messages in conversation
            context_type: Type of context (placement, faq, general)
            max_tokens: Maximum tokens for response
            
        Returns:
            Dictionary with response and metadata
        """
        
        if not self.client:
            return {
                "response": "I'm sorry, but the AI service is currently unavailable. Please try again later.",
                "confidence": 0.0,
                "context_used": [],
                "error": "Cohere API key not configured"
            }
        
        try:
            # Build context and conversation history
            context = self.context_templates.get(context_type, self.context_templates["general"])
            
            # Format conversation history
            conversation_text = ""
            if conversation_history:
                for msg in conversation_history[-10:]:  # Last 10 messages for context
                    role_text = "Human: " if msg.role == MessageRole.USER else "Assistant: "
                    conversation_text += f"{role_text}{msg.content}\n"
            
            # Create the prompt
            prompt = f"""{context}

Previous conversation:
{conversation_text}
Human: {message}
Assistant:"""
            
            # Generate response using Cohere
            response = self.client.generate(
                model='command-r-plus',
                prompt=prompt,
                max_tokens=max_tokens or settings.MAX_RESPONSE_LENGTH,
                temperature=0.7,
                k=0,
                stop_sequences=["Human:", "Assistant:"],
                return_likelihoods='GENERATION'
            )
            
            # Extract response text
            response_text = response.generations[0].text.strip()
            
            # Calculate confidence score (simplified)
            confidence = min(response.generations[0].likelihood or 0.5, 1.0)
            
            # Generate suggested actions based on context
            suggested_actions = self._generate_suggested_actions(context_type, message)
            
            return {
                "response": response_text,
                "confidence": confidence,
                "context_used": [context_type],
                "suggested_actions": suggested_actions
            }
            
        except Exception as e:
            logger.error(f"Error generating response: {str(e)}")
            return {
                "response": "I'm sorry, I encountered an error while processing your request. Please try again.",
                "confidence": 0.0,
                "context_used": [],
                "error": str(e)
            }
    
    def _generate_suggested_actions(self, context_type: str, message: str) -> List[str]:
        """Generate suggested actions based on context and message"""
        suggestions = []
        
        if context_type == "placement":
            if any(word in message.lower() for word in ["interview", "preparation", "coding"]):
                suggestions.extend([
                    "Practice coding problems on LeetCode",
                    "Schedule a mock interview",
                    "Review system design concepts"
                ])
            elif any(word in message.lower() for word in ["resume", "cv"]):
                suggestions.extend([
                    "Get resume reviewed by alumni",
                    "Update your LinkedIn profile",
                    "Add relevant projects to your resume"
                ])
        
        elif context_type == "faq":
            suggestions.extend([
                "Browse alumni directory",
                "Join upcoming events",
                "Explore forum discussions"
            ])
        
        else:  # general
            suggestions.extend([
                "Connect with alumni in your field",
                "Participate in forum discussions",
                "Attend networking events"
            ])
        
        return suggestions[:3]  # Return max 3 suggestions
    
    async def health_check(self) -> Dict[str, str]:
        """Check if Cohere service is healthy"""
        if not self.client:
            return {"status": "error", "message": "API key not configured"}
        
        try:
            # Test with a simple generation
            response = self.client.generate(
                model='command-r-plus',
                prompt="Hello",
                max_tokens=5
            )
            return {"status": "healthy", "message": "Cohere API is accessible"}
        except Exception as e:
            logger.error(f"Cohere health check failed: {str(e)}")
            return {"status": "error", "message": f"API error: {str(e)}"}