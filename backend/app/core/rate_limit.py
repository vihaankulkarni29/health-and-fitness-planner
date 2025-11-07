"""
Rate limiting configuration and utilities.

This module provides rate limiting for API endpoints to prevent abuse:
- Authentication endpoints (login, register)
- Sensitive operations (create, update, delete)
- High-frequency endpoints
"""
from slowapi import Limiter
from slowapi.util import get_remote_address
from fastapi import Request
import os


def get_client_ip(request: Request) -> str:
    """
    Get client IP address from request.
    
    Checks X-Forwarded-For header first (for proxy/load balancer scenarios),
    then falls back to direct client IP.
    
    Args:
        request: FastAPI request object
        
    Returns:
        Client IP address as string
    """
    forwarded = request.headers.get("X-Forwarded-For")
    if forwarded:
        # X-Forwarded-For can contain multiple IPs, take the first one
        return forwarded.split(",")[0].strip()
    return get_remote_address(request)


# Rate limiter instance
# Storage: in-memory (for production, use Redis)
limiter = Limiter(
    key_func=get_client_ip,
    default_limits=["1000 per hour"],  # Global default limit
    storage_uri=os.getenv("RATE_LIMIT_STORAGE_URI", "memory://"),
    # For production with Redis: "redis://localhost:6379"
)

# Common rate limit strings (can be overridden via environment variables)
RATE_LIMIT_AUTH = os.getenv("RATE_LIMIT_AUTH", "5 per minute")  # Login, register
RATE_LIMIT_WRITE = os.getenv("RATE_LIMIT_WRITE", "10 per minute")  # Create, update, delete
RATE_LIMIT_READ = os.getenv("RATE_LIMIT_READ", "100 per minute")  # Read operations
RATE_LIMIT_STRICT = os.getenv("RATE_LIMIT_STRICT", "3 per minute")  # Extra strict for sensitive ops
