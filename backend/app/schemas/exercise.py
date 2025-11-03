from pydantic import BaseModel
from typing import Optional

# Shared properties
class ExerciseBase(BaseModel):
    name: str
    description: Optional[str] = None
    video_url: Optional[str] = None

# Properties to receive on item creation
class ExerciseCreate(ExerciseBase):
    pass

# Properties to receive on item update
class ExerciseUpdate(ExerciseBase):
    pass

# Properties to return to client
class Exercise(ExerciseBase):
    id: int

    class Config:
        orm_mode = True
