from pydantic import BaseModel, validator, Field
from typing import Optional
from .exercise import Exercise
from app.core.validation import validate_positive_integer, validate_positive_number

# Shared properties
class ProgramExerciseBase(BaseModel):
    program_id: int = Field(..., ge=1, description="Program ID")
    exercise_id: int = Field(..., ge=1, description="Exercise ID")
    order: int = Field(..., ge=1, le=100, description="Exercise order in program (1-100)")
    prescribed_sets: Optional[int] = Field(None, ge=0, le=100, description="Prescribed sets (0-100)")
    prescribed_reps: Optional[int] = Field(None, ge=0, le=1000, description="Prescribed reps (0-1000)")
    prescribed_weight_kg: Optional[float] = Field(None, ge=0, le=1000, description="Prescribed weight in kg (0-1000)")
    
    @validator('prescribed_sets')
    def validate_sets(cls, v):
        return validate_positive_integer(v, "Prescribed sets")
    
    @validator('prescribed_reps')
    def validate_reps(cls, v):
        return validate_positive_integer(v, "Prescribed reps")
    
    @validator('prescribed_weight_kg')
    def validate_weight(cls, v):
        return validate_positive_number(v, "Prescribed weight")

# Properties to receive on item creation
class ProgramExerciseCreate(ProgramExerciseBase):
    pass

# Properties to receive on item update
class ProgramExerciseUpdate(BaseModel):
    program_id: Optional[int] = Field(None, ge=1)
    exercise_id: Optional[int] = Field(None, ge=1)
    order: Optional[int] = Field(None, ge=1, le=100)
    prescribed_sets: Optional[int] = Field(None, ge=0, le=100)
    prescribed_reps: Optional[int] = Field(None, ge=0, le=1000)
    prescribed_weight_kg: Optional[float] = Field(None, ge=0, le=1000)
    
    @validator('prescribed_sets')
    def validate_sets(cls, v):
        if v is not None:
            return validate_positive_integer(v, "Prescribed sets")
        return v
    
    @validator('prescribed_reps')
    def validate_reps(cls, v):
        if v is not None:
            return validate_positive_integer(v, "Prescribed reps")
        return v
    
    @validator('prescribed_weight_kg')
    def validate_weight(cls, v):
        if v is not None:
            return validate_positive_number(v, "Prescribed weight")
        return v

# Properties to return to client
class ProgramExercise(ProgramExerciseBase):
    id: int
    exercise: Optional[Exercise] = None

    class Config:
        orm_mode = True
