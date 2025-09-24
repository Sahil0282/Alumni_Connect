"""
Error handling middleware for the FastAPI application
"""

import logging
import traceback
from fastapi import Request, Response
from fastapi.responses import JSONResponse
from starlette.middleware.base import BaseHTTPMiddleware
from datetime import datetime

logger = logging.getLogger(__name__)


class ErrorHandlerMiddleware(BaseHTTPMiddleware):
    """Middleware to handle and log errors consistently"""
    
    async def dispatch(self, request: Request, call_next):
        try:
            response = await call_next(request)
            return response
        
        except Exception as exc:
            # Log the error with full traceback
            logger.error(
                f"Unhandled error in {request.method} {request.url}: {str(exc)}\n"
                f"Traceback: {traceback.format_exc()}"
            )
            
            # Return a generic error response
            error_response = {
                "error": "Internal server error",
                "message": "An unexpected error occurred. Please try again later.",
                "timestamp": datetime.utcnow().isoformat(),
                "path": str(request.url.path)
            }
            
            # In debug mode, include more details
            if hasattr(request.app.state, 'debug') and request.app.state.debug:
                error_response["details"] = str(exc)
                error_response["type"] = type(exc).__name__
            
            return JSONResponse(
                status_code=500,
                content=error_response
            )