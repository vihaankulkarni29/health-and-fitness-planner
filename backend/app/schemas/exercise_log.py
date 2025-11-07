from pydantic import BaseModel, validator, Field
from datetime import datetime
from typing import Optional
from .exercise import Exercise
from app.core.validation import validate_positive_number, validate_positive_integer

# Shared properties
class ExerciseLogBase(BaseModel):
    session_id: Optional[int] = Field(None, ge=1, description="Workout session ID")
    exercise_id: int = Field(..., ge=1, description="Exercise ID")
    completed_sets: Optional[int] = Field(None, ge=0, le=100, description="Number of sets completed (0-100)")
    completed_reps: Optional[int] = Field(None, ge=0, le=1000, description="Number of reps completed (0-1000)")
    completed_weight_kg: Optional[float] = Field(None, ge=0, le=1000, description="Weight used in kg (0-1000)")
    volume_kg: Optional[float] = Field(None, ge=0, description="Total volume (sets × reps × weight)")
    is_completed: bool = Field(True, description="Whether the exercise was completed")
    
    @validator('completed_sets')
    def validate_sets(cls, v):
        return validate_positive_integer(v, "Completed sets")
    
    @validator('completed_reps')
    def validate_reps(cls, v):
        return validate_positive_integer(v, "Completed reps")
    
    @validator('completed_weight_kg', 'volume_kg')
    def validate_weight(cls, v):
        return validate_positive_number(v, "Weight")

# Properties to receive on item creation
class ExerciseLogCreate(ExerciseLogBase):
    pass

# Properties to receive on item update
class ExerciseLogUpdate(BaseModel):
    session_id: Optional[int] = Field(None, ge=1)
    exercise_id: Optional[int] = Field(None, ge=1)
    completed_sets: Optional[int] = Field(None, ge=0, le=100)
    completed_reps: Optional[int] = Field(None, ge=0, le=1000)
    completed_weight_kg: Optional[float] = Field(None, ge=0, le=1000)
    volume_kg: Optional[float] = Field(None, ge=0)
    is_completed: Optional[bool] = None
    
    @validator('completed_sets')
    def validate_sets(cls, v):
        if v is not None:
            return validate_positive_integer(v, "Completed sets")
        return v
    
    @validator('completed_reps')
    def validate_reps(cls, v):
        if v is not None:
            return validate_positive_integer(v, "Completed reps")
        return v
    
    @validator('completed_weight_kg', 'volume_kg')
    def validate_weight(cls, v):
        if v is not None:
            return validate_positive_number(v, "Weight")
        return v

# Properties to return to client
class ExerciseLog(ExerciseLogBase):
    id: int
    logged_at: datetime
    exercise: Optional[Exercise] = None

    class Config:
        orm_mode = True
