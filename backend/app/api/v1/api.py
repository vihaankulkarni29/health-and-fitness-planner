from fastapi import APIRouter

from app.api.v1.endpoints import gyms, trainers

api_router = APIRouter()
api_router.include_router(gyms.router, prefix="/gyms", tags=["gyms"])
api_router.include_router(trainers.router, prefix="/trainers", tags=["trainers"])
