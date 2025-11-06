from pydantic import BaseModel
from datetime import datetime
from typing import Optional

# Shared properties
class HealthMetricBase(BaseModel):
    height_cm: Optional[float] = None
    weight_kg: Optional[float] = None
    body_fat_percentage: Optional[float] = None
    trainee_id: Optional[int] = None

# Properties to receive on item creation
class HealthMetricCreate(BaseModel):
    trainee_id: int
    height_cm: Optional[float] = None
    weight_kg: Optional[float] = None
    body_fat_percentage: Optional[float] = None

# Properties to receive on item update
class HealthMetricUpdate(HealthMetricBase):
    pass  # All fields optional for partial updates

# Properties to return to client
class HealthMetric(HealthMetricBase):
    id: int
    recorded_at: datetime

    class Config:
        orm_mode = True
