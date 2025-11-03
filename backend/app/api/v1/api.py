from fastapi import APIRouter

from app.api.v1.endpoints import gyms

api_router = APIRouter()
api_router.include_router(gyms.router, prefix="/gyms", tags=["gyms"])
