from pydantic import BaseModel, validator, Field
from datetime import datetime
from typing import Optional
from app.core.validation import validate_name, sanitize_string, MAX_NAME_LENGTH, MAX_DESCRIPTION_LENGTH

# Shared properties
class GymBase(BaseModel):
    name: str = Field(..., min_length=1, max_length=MAX_NAME_LENGTH, description="Gym name")
    address: Optional[str] = Field(None, max_length=MAX_DESCRIPTION_LENGTH, description="Gym address")
    
    @validator('name')
    def validate_gym_name(cls, v):
        return validate_name(v)
    
    @validator('address')
    def sanitize_address(cls, v):
        if v:
            return sanitize_string(v, max_length=MAX_DESCRIPTION_LENGTH)
        return v

# Properties to receive on item creation
class GymCreate(GymBase):
    pass

# Properties to receive on item update
class GymUpdate(BaseModel):
    name: Optional[str] = Field(None, min_length=1, max_length=MAX_NAME_LENGTH)
    address: Optional[str] = Field(None, max_length=MAX_DESCRIPTION_LENGTH)
    
    @validator('name')
    def validate_gym_name(cls, v):
        if v is not None:
            return validate_name(v)
        return v
    
    @validator('address')
    def sanitize_address(cls, v):
        if v:
            return sanitize_string(v, max_length=MAX_DESCRIPTION_LENGTH)
        return v

# Properties to return to client
class Gym(GymBase):
    id: int
    created_at: datetime

    class Config:
        orm_mode = True
