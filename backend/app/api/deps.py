"""Common FastAPI dependencies used by API routers."""
from typing import Generator
from sqlalchemy.orm import Session

from app.db.session import SessionLocal


def get_db() -> Generator[Session, None, None]:
    """Yield a SQLAlchemy session and ensure it is closed after use.

    NOTE: Consider using an async database driver and async session for improved performance.
    """
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
