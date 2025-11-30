from pydantic_settings import BaseSettings, SettingsConfigDict
from pydantic import Field, model_validator
from typing import Any


import os

class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

    SQLALCHEMY_DATABASE_URI: str = Field(
        default_factory=lambda: os.getenv("SQLALCHEMY_DATABASE_URI", "sqlite:///./fitness_tracker.db"),
        description="Database connection string"
    )
    API_V1_STR: str = "/api/v1"
    
    # JWT settings
    SECRET_KEY: str = Field(
        default_factory=lambda: os.getenv("SECRET_KEY", "dev-secret-key-please-change-in-production-12345678901234567890"),
        description="Secret key for JWT. Must be set in .env"
    )
    # Shortened access token lifetime for improved security; rely on refresh rotation
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 15  # 15 minutes
    ALGORITHM: str = "HS256"
    REFRESH_TOKEN_EXPIRE_DAYS: int = 7  # 7 days default

    # Admin Setup
    FIRST_SUPERUSER: str = "admin@example.com"
    FIRST_SUPERUSER_PASSWORD: str = "admin"

    CORS_ORIGINS_STR: str = Field(
        default="http://localhost:3000,http://localhost:8000,http://127.0.0.1:3000",
        description="Allowed CORS origins (comma-separated string in .env)"
    )

    ENVIRONMENT: str = Field(default="local", description="Environment: local, staging, production")

    @property
    def CORS_ORIGINS(self) -> list[str]:
        return [origin.strip() for origin in self.CORS_ORIGINS_STR.split(",")]

    @model_validator(mode='after')
    def check_secret_key_in_production(self):
        if self.ENVIRONMENT == "production":
            default_secret = "dev-secret-key-please-change-in-production-12345678901234567890"
            if self.SECRET_KEY == default_secret:
                raise ValueError("SECRET_KEY must be changed in production environment!")
        return self

settings = Settings()