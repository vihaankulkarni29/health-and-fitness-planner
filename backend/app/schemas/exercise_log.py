from pydantic import BaseModel
from datetime import datetime
from typing import Optional
from .exercise import Exercise

# Shared properties
class ExerciseLogBase(BaseModel):
    session_id: Optional[int] = None
    exercise_id: int
    completed_sets: Optional[int] = None
    completed_reps: Optional[int] = None
    completed_weight_kg: Optional[float] = None
    volume_kg: Optional[float] = None
    is_completed: bool = True

# Properties to receive on item creation
class ExerciseLogCreate(ExerciseLogBase):
    pass

# Properties to receive on item update
class ExerciseLogUpdate(BaseModel):
    session_id: Optional[int] = None
    exercise_id: Optional[int] = None
    completed_sets: Optional[int] = None
    completed_reps: Optional[int] = None
    completed_weight_kg: Optional[float] = None
    volume_kg: Optional[float] = None
    is_completed: Optional[bool] = None

# Properties to return to client
class ExerciseLog(ExerciseLogBase):
    id: int
    logged_at: datetime
    exercise: Optional[Exercise] = None

    class Config:
        orm_mode = True
