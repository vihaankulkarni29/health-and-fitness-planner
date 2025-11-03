import os
from pydantic import BaseSettings

class Settings(BaseSettings):
    SQLALCHEMY_DATABASE_URI: str = os.getenv("DATABASE_URL", "postgresql://user:password@localhost/db")

    class Config:
        case_sensitive = True

settings = Settings()
