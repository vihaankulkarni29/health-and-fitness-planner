from pydantic import BaseModel, EmailStr, validator, Field
from datetime import datetime
from typing import Optional
from .gym import Gym
from app.core.validation import validate_name, MAX_NAME_LENGTH, MAX_EMAIL_LENGTH

# Shared properties
class TrainerBase(BaseModel):
    first_name: str = Field(..., min_length=1, max_length=MAX_NAME_LENGTH, description="Trainer's first name")
    last_name: str = Field(..., min_length=1, max_length=MAX_NAME_LENGTH, description="Trainer's last name")
    email: EmailStr = Field(..., max_length=MAX_EMAIL_LENGTH, description="Trainer's email address")
    gym_id: Optional[int] = Field(None, ge=1, description="Gym ID")
    
    @validator('first_name', 'last_name')
    def validate_trainer_name(cls, v):
        return validate_name(v)

# Properties to receive on item creation
class TrainerCreate(TrainerBase):
    pass

# Properties to receive on item update
class TrainerUpdate(BaseModel):
    first_name: Optional[str] = Field(None, min_length=1, max_length=MAX_NAME_LENGTH)
    last_name: Optional[str] = Field(None, min_length=1, max_length=MAX_NAME_LENGTH)
    email: Optional[EmailStr] = Field(None, max_length=MAX_EMAIL_LENGTH)
    gym_id: Optional[int] = Field(None, ge=1)
    
    @validator('first_name', 'last_name')
    def validate_trainer_name(cls, v):
        if v is not None:
            return validate_name(v)
        return v

# Properties to return to client
class Trainer(TrainerBase):
    id: int
    created_at: datetime
    gym: Optional[Gym] = None

    class Config:
        orm_mode = True
