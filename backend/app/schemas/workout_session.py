from pydantic import BaseModel
from datetime import date
from typing import Optional
from .program import Program
from .trainee import Trainee

# Shared properties
class WorkoutSessionBase(BaseModel):
    trainee_id: int
    program_id: int
    session_date: date
    status: str

# Properties to receive on item creation
class WorkoutSessionCreate(WorkoutSessionBase):
    pass

# Properties to return to client
class WorkoutSession(WorkoutSessionBase):
    id: int
    program: Optional[Program] = None
    trainee: Optional[Trainee] = None

    class Config:
        orm_mode = True
