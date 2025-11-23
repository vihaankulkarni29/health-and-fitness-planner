from pydantic import BaseModel, validator, Field
from datetime import datetime
from typing import Optional, List
from .trainer import Trainer
from app.core.validation import (
    sanitize_string,
    MAX_NAME_LENGTH,
    MAX_DESCRIPTION_LENGTH,
)

# Shared properties
class ProgramBase(BaseModel):
    name: str = Field(..., min_length=1, max_length=MAX_NAME_LENGTH, description="Program name")
    description: Optional[str] = Field(None, max_length=MAX_DESCRIPTION_LENGTH, description="Program description")
    trainer_id: Optional[int] = Field(None, ge=1, description="ID of the trainer who created this program")
    
    @validator('name')
    def validate_name_field(cls, v):
        return sanitize_string(v, MAX_NAME_LENGTH)
    
    @validator('description')
    def validate_description_field(cls, v):
        if v is not None:
            return sanitize_string(v, MAX_DESCRIPTION_LENGTH)
        return v

from .program_exercise import ProgramExerciseCreate

# Properties to receive on item creation
class ProgramCreate(ProgramBase):
    name: str = Field(..., min_length=1, max_length=MAX_NAME_LENGTH)
    trainer_id: int = Field(..., ge=1, description="Trainer ID is required on creation")
    exercises: Optional[List[ProgramExerciseCreate]] = []

# Properties to receive on item update
class ProgramUpdate(ProgramBase):
    name: Optional[str] = Field(None, min_length=1, max_length=MAX_NAME_LENGTH)

# Properties to return to client
class Program(ProgramBase):
    id: int
    created_at: datetime
    trainer: Optional[Trainer] = None

    class Config:
        orm_mode = True
