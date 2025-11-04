from fastapi import APIRouter

from app.api.v1.endpoints import gyms, trainers, trainees, programs, exercises, health_metrics, program_exercises, workout_sessions, exercise_logs
from app.auth import api as auth_api

api_router = APIRouter()
api_router.include_router(auth_api.router, tags=["auth"])
api_router.include_router(gyms.router, prefix="/gyms", tags=["gyms"])
api_router.include_router(trainers.router, prefix="/trainers", tags=["trainers"])
api_router.include_router(trainees.router, prefix="/trainees", tags=["trainees"])
api_router.include_router(programs.router, prefix="/programs", tags=["programs"])
api_router.include_router(exercises.router, prefix="/exercises", tags=["exercises"])
api_router.include_router(health_metrics.router, prefix="/health_metrics", tags=["health_metrics"])
api_router.include_router(program_exercises.router, prefix="/program_exercises", tags=["program_exercises"])
api_router.include_router(workout_sessions.router, prefix="/workout_sessions", tags=["workout_sessions"])
api_router.include_router(exercise_logs.router, prefix="/exercise_logs", tags=["exercise_logs"])
