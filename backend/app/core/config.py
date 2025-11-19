from pydantic_settings import BaseSettings, SettingsConfigDict
from pydantic import Field
from typing import Any


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env")

    SQLALCHEMY_DATABASE_URI: str = ""
    API_V1_STR: str = "/api/v1"
    # JWT settings
    SECRET_KEY: str = Field(..., description="Secret key for JWT. Must be set in .env")
    # Shortened access token lifetime for improved security; rely on refresh rotation
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 15  # 15 minutes
    ALGORITHM: str = "HS256"
    REFRESH_TOKEN_EXPIRE_DAYS: int = 7  # 7 days default

    CORS_ORIGINS_STR: str = Field(
        default="http://localhost:3000,http://localhost:8000",
        description="Allowed CORS origins (comma-separated string in .env)"
    )

    @property
    def CORS_ORIGINS(self) -> list[str]:
        return [origin.strip() for origin in self.CORS_ORIGINS_STR.split(",")]


settings = Settings()