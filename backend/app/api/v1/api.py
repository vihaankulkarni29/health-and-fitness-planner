from fastapi import APIRouter

from app.api.v1.endpoints import gyms, trainers, trainees, programs

api_router = APIRouter()
api_router.include_router(gyms.router, prefix="/gyms", tags=["gyms"])
api_router.include_router(trainers.router, prefix="/trainers", tags=["trainers"])
api_router.include_router(trainees.router, prefix="/trainees", tags=["trainees"])
api_router.include_router(programs.router, prefix="/programs", tags=["programs"])
