from pydantic import BaseModel
from typing import Optional
from .exercise import Exercise

# Shared properties
class ProgramExerciseBase(BaseModel):
    program_id: int
    exercise_id: int
    order: int
    prescribed_sets: Optional[int] = None
    prescribed_reps: Optional[int] = None
    prescribed_weight_kg: Optional[float] = None

# Properties to receive on item creation
class ProgramExerciseCreate(ProgramExerciseBase):
    pass

# Properties to receive on item update
class ProgramExerciseUpdate(ProgramExerciseBase):
    pass

# Properties to return to client
class ProgramExercise(ProgramExerciseBase):
    id: int
    exercise: Optional[Exercise] = None

    class Config:
        orm_mode = True
