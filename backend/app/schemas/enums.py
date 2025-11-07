from enum import Enum

class WorkoutSessionStatus(str, Enum):
    PLANNED = "planned"
    IN_PROGRESS = "in-progress"
    COMPLETED = "completed"
