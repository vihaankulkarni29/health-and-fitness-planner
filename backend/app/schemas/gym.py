from pydantic import BaseModel
from datetime import datetime
from typing import Optional

# Shared properties
class GymBase(BaseModel):
    name: str
    address: Optional[str] = None

# Properties to receive on item creation
class GymCreate(GymBase):
    pass

# Properties to return to client
class Gym(GymBase):
    id: int
    created_at: datetime

    class Config:
        orm_mode = True
