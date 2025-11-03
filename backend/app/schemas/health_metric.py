from pydantic import BaseModel
from datetime import datetime
from typing import Optional

# Shared properties
class HealthMetricBase(BaseModel):
    height_cm: Optional[float] = None
    weight_kg: Optional[float] = None
    body_fat_percentage: Optional[float] = None
    trainee_id: int

# Properties to receive on item creation
class HealthMetricCreate(HealthMetricBase):
    pass

# Properties to return to client
class HealthMetric(HealthMetricBase):
    id: int
    recorded_at: datetime

    class Config:
        orm_mode = True
