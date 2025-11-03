import os
import sys
import tempfile
from typing import Generator

import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

# Ensure the 'backend' directory is on sys.path so we can import the 'app' package
CURRENT_DIR = os.path.dirname(__file__)
BACKEND_ROOT = os.path.abspath(os.path.join(CURRENT_DIR, ".."))
if BACKEND_ROOT not in sys.path:
    sys.path.insert(0, BACKEND_ROOT)

from app.main import app  # noqa: E402
from app.db.base import Base  # noqa: E402
from app.api.v1.endpoints.gyms import get_db as gyms_get_db  # noqa: E402


@pytest.fixture(scope="session")
def sqlite_db_url() -> str:
    # Create a temporary SQLite file-backed database for the test session
    tmp = tempfile.NamedTemporaryFile(delete=False, suffix=".db")
    tmp.close()
    return f"sqlite:///{tmp.name}"


@pytest.fixture(scope="session")
def engine(sqlite_db_url: str):
    engine = create_engine(sqlite_db_url, connect_args={"check_same_thread": False})
    # Create all tables for the duration of the test session
    Base.metadata.create_all(bind=engine)  # type: ignore[attr-defined]
    yield engine
    # Teardown: drop all tables and remove the temp db file
    Base.metadata.drop_all(bind=engine)  # type: ignore[attr-defined]
    db_path = sqlite_db_url.replace("sqlite:///", "")
    try:
        os.remove(db_path)
    except OSError:
        pass


@pytest.fixture()
def db_session(engine) -> Generator:
    TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
    db = TestingSessionLocal()
    try:
        yield db
    finally:
        db.close()


@pytest.fixture()
def client(db_session) -> Generator:
    # Override the dependency to use our test DB session
    def override_get_db():
        try:
            yield db_session
        finally:
            pass

    app.dependency_overrides[gyms_get_db] = override_get_db
    with TestClient(app) as c:
        yield c
    # Cleanup override
    app.dependency_overrides.pop(gyms_get_db, None)
