"""
Backend server startup script with health checks
Run this to start the FastAPI server with proper configuration
"""
import sys
import os

# Add the app directory to Python path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), 'app'))

if __name__ == "__main__":
    import uvicorn
    from app.core.config import settings
    
    print("=" * 60)
    print("🏋️  Health & Fitness Planner API")
    print("=" * 60)
    print(f"📍 Server URL: http://localhost:8000")
    print(f"📚 API Docs: http://localhost:8000/docs")
    print(f"🔒 CORS Origins: {settings.CORS_ORIGINS}")
    print(f"⏰ Access Token TTL: {settings.ACCESS_TOKEN_EXPIRE_MINUTES} minutes")
    print(f"🔄 Refresh Token TTL: {settings.REFRESH_TOKEN_EXPIRE_DAYS} days")
    print("=" * 60)
    print("\n✅ Starting server...\n")
    
    uvicorn.run(
        "app.main:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
        log_level="info"
    )
