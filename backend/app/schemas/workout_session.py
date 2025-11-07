from pydantic import BaseModel, Field
from datetime import date
from typing import List, Optional

from app.schemas.exercise_log import ExerciseLog
from app.schemas.enums import WorkoutSessionStatus

# Shared properties
class WorkoutSessionBase(BaseModel):
    trainee_id: int = Field(..., ge=1, description="Trainee ID")
    program_id: int = Field(..., ge=1, description="Program ID")
    session_date: date = Field(..., description="Date of the workout session")
    status: WorkoutSessionStatus = Field(..., description="Workout session status")

# Properties to receive on item creation
class WorkoutSessionCreate(BaseModel):
    trainee_id: int = Field(..., ge=1)
    program_id: int = Field(..., ge=1)

# Properties to receive on item update
class WorkoutSessionUpdate(BaseModel):
    status: Optional[WorkoutSessionStatus] = None

# Properties shared by models stored in DB
class WorkoutSessionInDBBase(WorkoutSessionBase):
    id: int
    exercise_logs: List[ExerciseLog] = []

    class Config:
        orm_mode = True

# Properties to return to client
class WorkoutSession(WorkoutSessionInDBBase):
    pass

# Properties stored in DB
class WorkoutSessionInDB(WorkoutSessionInDBBase):
    pass