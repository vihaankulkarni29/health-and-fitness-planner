from pydantic import BaseModel
from datetime import datetime
from typing import Optional, List
from .trainer import Trainer

# Shared properties
class ProgramBase(BaseModel):
    name: str
    description: Optional[str] = None
    trainer_id: Optional[int] = None

# Properties to receive on item creation
class ProgramCreate(ProgramBase):
    name: str
    trainer_id: int

# Properties to return to client
class Program(ProgramBase):
    id: int
    created_at: datetime
    trainer: Optional[Trainer] = None

    class Config:
        orm_mode = True
