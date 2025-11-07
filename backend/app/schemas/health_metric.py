from pydantic import BaseModel, validator, Field
from datetime import datetime
from typing import Optional
from app.core.validation import validate_range

# Shared properties
class HealthMetricBase(BaseModel):
    height_cm: Optional[float] = Field(
        None, 
        ge=50.0, 
        le=300.0, 
        description="Height in centimeters (50-300cm)"
    )
    weight_kg: Optional[float] = Field(
        None, 
        ge=20.0, 
        le=500.0, 
        description="Weight in kilograms (20-500kg)"
    )
    body_fat_percentage: Optional[float] = Field(
        None, 
        ge=1.0, 
        le=60.0, 
        description="Body fat percentage (1-60%)"
    )
    trainee_id: Optional[int] = Field(None, ge=1, description="Trainee ID")
    
    @validator('height_cm')
    def validate_height(cls, v):
        if v is not None:
            return validate_range(v, 50.0, 300.0, "Height")
        return v
    
    @validator('weight_kg')
    def validate_weight(cls, v):
        if v is not None:
            return validate_range(v, 20.0, 500.0, "Weight")
        return v
    
    @validator('body_fat_percentage')
    def validate_body_fat(cls, v):
        if v is not None:
            return validate_range(v, 1.0, 60.0, "Body fat percentage")
        return v

# Properties to receive on item creation
class HealthMetricCreate(HealthMetricBase):
    trainee_id: int = Field(..., ge=1, description="Trainee ID (required)")

# Properties to receive on item update
class HealthMetricUpdate(BaseModel):
    height_cm: Optional[float] = Field(None, ge=50.0, le=300.0)
    weight_kg: Optional[float] = Field(None, ge=20.0, le=500.0)
    body_fat_percentage: Optional[float] = Field(None, ge=1.0, le=60.0)
    trainee_id: Optional[int] = Field(None, ge=1)
    
    @validator('height_cm')
    def validate_height(cls, v):
        if v is not None:
            return validate_range(v, 50.0, 300.0, "Height")
        return v
    
    @validator('weight_kg')
    def validate_weight(cls, v):
        if v is not None:
            return validate_range(v, 20.0, 500.0, "Weight")
        return v
    
    @validator('body_fat_percentage')
    def validate_body_fat(cls, v):
        if v is not None:
            return validate_range(v, 1.0, 60.0, "Body fat percentage")
        return v

# Properties to return to client
class HealthMetric(HealthMetricBase):
    id: int
    trainee_id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        orm_mode = True
