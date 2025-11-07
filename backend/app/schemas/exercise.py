from pydantic import BaseModel, validator, Field
from typing import Optional
from app.core.validation import (
    sanitize_string,
    validate_url,
    MAX_NAME_LENGTH,
    MAX_DESCRIPTION_LENGTH,
)

# Shared properties
class ExerciseBase(BaseModel):
    name: str = Field(..., min_length=1, max_length=MAX_NAME_LENGTH, description="Exercise name")
    description: Optional[str] = Field(None, max_length=MAX_DESCRIPTION_LENGTH, description="Exercise description")
    video_url: Optional[str] = Field(None, description="URL to exercise demonstration video")
    
    @validator('name')
    def validate_name_field(cls, v):
        return sanitize_string(v, MAX_NAME_LENGTH)
    
    @validator('description')
    def validate_description_field(cls, v):
        if v is not None:
            return sanitize_string(v, MAX_DESCRIPTION_LENGTH)
        return v
    
    @validator('video_url')
    def validate_video_url_field(cls, v):
        return validate_url(v)

# Properties to receive on item creation
class ExerciseCreate(ExerciseBase):
    pass

# Properties to receive on item update
class ExerciseUpdate(ExerciseBase):
    name: Optional[str] = Field(None, min_length=1, max_length=MAX_NAME_LENGTH)

# Properties to return to client
class Exercise(ExerciseBase):
    id: int

    class Config:
        orm_mode = True
