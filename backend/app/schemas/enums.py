from enum import Enum

class WorkoutSessionStatus(str, Enum):
    IN_PROGRESS = "in-progress"
    COMPLETED = "completed"
