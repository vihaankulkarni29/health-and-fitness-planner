from pydantic import BaseModel, EmailStr
from datetime import datetime
from typing import Optional
from .gym import Gym
from .trainer import Trainer
from .program import Program

# Shared properties
class TraineeBase(BaseModel):
    first_name: str
    last_name: str
    email: EmailStr
    gym_id: Optional[int] = None
    trainer_id: Optional[int] = None
    program_id: Optional[int] = None

# Properties to receive on item creation
class TraineeCreate(TraineeBase):
    password: str

# Properties to receive on item update
class TraineeUpdate(BaseModel):
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    email: Optional[EmailStr] = None
    gym_id: Optional[int] = None
    trainer_id: Optional[int] = None
    program_id: Optional[int] = None

# Properties to return to client
class Trainee(TraineeBase):
    id: int
    created_at: datetime
    gym: Optional[Gym] = None
    trainer: Optional[Trainer] = None
    program: Optional[Program] = None

    class Config:
        orm_mode = True
