"""
Rate limiting functionality for the chatbot API
"""

import time
from typing import Dict, Optional
from fastapi import HTTPException, Request
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded
from app.core.config import settings
import logging

logger = logging.getLogger(__name__)


def get_client_ip(request: Request) -> str:
    """Get client IP address from request"""
    # Check for forwarded IP first (in case of proxy/load balancer)
    forwarded_ip = request.headers.get("X-Forwarded-For")
    if forwarded_ip:
        return forwarded_ip.split(",")[0].strip()
    
    # Check for real IP header
    real_ip = request.headers.get("X-Real-IP")
    if real_ip:
        return real_ip
    
    # Fall back to remote address
    return get_remote_address(request)


class RateLimiter:
    """Simple in-memory rate limiter"""
    
    def __init__(self):
        self.requests: Dict[str, list] = {}
        self.blocked_ips: Dict[str, float] = {}
    
    def is_allowed(self, client_ip: str, limit: int = None, window: int = None) -> bool:
        """
        Check if request is allowed based on rate limit
        
        Args:
            client_ip: Client IP address
            limit: Number of requests allowed (default from settings)
            window: Time window in seconds (default from settings)
        
        Returns:
            True if request is allowed, False otherwise
        """
        limit = limit or settings.RATE_LIMIT_REQUESTS
        window = window or settings.RATE_LIMIT_WINDOW
        
        current_time = time.time()
        
        # Check if IP is temporarily blocked
        if client_ip in self.blocked_ips:
            if current_time < self.blocked_ips[client_ip]:
                return False
            else:
                # Remove expired block
                del self.blocked_ips[client_ip]
        
        # Initialize or clean old requests for this IP
        if client_ip not in self.requests:
            self.requests[client_ip] = []
        
        # Remove requests outside the time window
        self.requests[client_ip] = [
            req_time for req_time in self.requests[client_ip]
            if current_time - req_time < window
        ]
        
        # Check if limit is exceeded
        if len(self.requests[client_ip]) >= limit:
            # Block IP for the remaining window time
            self.blocked_ips[client_ip] = current_time + window
            logger.warning(f"Rate limit exceeded for IP: {client_ip}")
            return False
        
        # Add current request
        self.requests[client_ip].append(current_time)
        return True
    
    def reset_ip(self, client_ip: str):
        """Reset rate limit for a specific IP"""
        if client_ip in self.requests:
            del self.requests[client_ip]
        if client_ip in self.blocked_ips:
            del self.blocked_ips[client_ip]
    
    def get_remaining_requests(self, client_ip: str, limit: int = None, window: int = None) -> int:
        """Get number of remaining requests for an IP"""
        limit = limit or settings.RATE_LIMIT_REQUESTS
        window = window or settings.RATE_LIMIT_WINDOW
        
        current_time = time.time()
        
        if client_ip not in self.requests:
            return limit
        
        # Clean old requests
        self.requests[client_ip] = [
            req_time for req_time in self.requests[client_ip]
            if current_time - req_time < window
        ]
        
        return max(0, limit - len(self.requests[client_ip]))


# Create limiter instance for slowapi
limiter = Limiter(
    key_func=get_client_ip,
    default_limits=[f"{settings.RATE_LIMIT_REQUESTS}/minute"]
)