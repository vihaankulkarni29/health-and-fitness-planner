from pydantic import BaseModel, EmailStr, validator, Field
from datetime import datetime
from typing import Optional
from .gym import Gym
from .trainer import Trainer
from .program import Program
from app.core.validation import (
    validate_name,
    validate_password,
    MAX_NAME_LENGTH,
    MAX_EMAIL_LENGTH,
    MIN_PASSWORD_LENGTH,
    MAX_PASSWORD_LENGTH,
)

# Shared properties
class TraineeBase(BaseModel):
    first_name: str = Field(..., min_length=1, max_length=MAX_NAME_LENGTH, description="First name of the trainee")
    last_name: str = Field(..., min_length=1, max_length=MAX_NAME_LENGTH, description="Last name of the trainee")
    email: EmailStr = Field(..., max_length=MAX_EMAIL_LENGTH, description="Email address")
    gym_id: Optional[int] = Field(None, ge=1, description="ID of the gym")
    trainer_id: Optional[int] = Field(None, ge=1, description="ID of the trainer")
    program_id: Optional[int] = Field(None, ge=1, description="ID of the assigned program")
    
    @validator('first_name', 'last_name')
    def validate_trainee_name(cls, v):
        return validate_name(v)

# Properties to receive on item creation
class TraineeCreate(TraineeBase):
    password: str = Field(
        ...,
        min_length=MIN_PASSWORD_LENGTH,
        max_length=MAX_PASSWORD_LENGTH,
        description=f"Password (minimum {MIN_PASSWORD_LENGTH} characters, must contain letter and number)"
    )
    
    @validator('password')
    def validate_password_field(cls, v):
        return validate_password(v)

# Properties to receive on item update
class TraineeUpdate(BaseModel):
    first_name: Optional[str] = Field(None, min_length=1, max_length=MAX_NAME_LENGTH)
    last_name: Optional[str] = Field(None, min_length=1, max_length=MAX_NAME_LENGTH)
    email: Optional[EmailStr] = Field(None, max_length=MAX_EMAIL_LENGTH)
    gym_id: Optional[int] = Field(None, ge=1)
    trainer_id: Optional[int] = Field(None, ge=1)
    program_id: Optional[int] = Field(None, ge=1)
    
    @validator('first_name', 'last_name')
    def validate_trainee_name(cls, v):
        if v is not None:
            return validate_name(v)
        return v

# Properties to return to client
class Trainee(TraineeBase):
    id: int
    created_at: datetime
    gym: Optional[Gym] = None
    trainer: Optional[Trainer] = None
    program: Optional[Program] = None

    class Config:
        orm_mode = True
