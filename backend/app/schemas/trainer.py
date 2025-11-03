from pydantic import BaseModel, EmailStr
from datetime import datetime
from typing import Optional
from .gym import Gym

# Shared properties
class TrainerBase(BaseModel):
    first_name: str
    last_name: str
    email: EmailStr
    gym_id: Optional[int] = None

# Properties to receive on item creation
class TrainerCreate(TrainerBase):
    pass

# Properties to receive on item update
class TrainerUpdate(TrainerBase):
    pass

# Properties to return to client
class Trainer(TrainerBase):
    id: int
    created_at: datetime
    gym: Optional[Gym] = None

    class Config:
        orm_mode = True
