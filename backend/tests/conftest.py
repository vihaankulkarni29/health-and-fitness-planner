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
from app.api.deps import get_db  # noqa: E402
from app.schemas.trainee import TraineeCreate  # noqa: E402
from app.auth.crud import create_user  # noqa: E402
from app.core.config import settings  # noqa: E402
from app.models.trainee import UserRole  # noqa: E402


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
    """Yield a SQLAlchemy session with a transaction that is rolled back after the test."""
    connection = engine.connect()
    transaction = connection.begin()
    TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=connection)
    db = TestingSessionLocal()

    try:
        yield db
    finally:
        db.close()
        transaction.rollback()
        connection.close()


@pytest.fixture()
def client(db_session) -> Generator:
    # Override the dependency to use our test DB session
    def override_get_db():
        try:
            yield db_session
        finally:
            pass

    app.dependency_overrides[get_db] = override_get_db
    with TestClient(app) as c:
        yield c
    # Cleanup override
    app.dependency_overrides.pop(get_db, None)


@pytest.fixture()
def auth_headers(client: TestClient, db_session) -> dict[str, str]:
    """
    Create a test user and return authentication headers with valid JWT token.
    This fixture can be used to authenticate requests in tests.
    """
    # Try to create a test user, but handle the case where it already exists
    user_in = TraineeCreate(
        email="testuser@example.com",
        password="testpassword123",
        first_name="Test",
        last_name="User",
    )
    
    # Check if user already exists
    from app.auth.crud import get_user_by_email
    existing_user = get_user_by_email(db_session, email=user_in.email)
    
    if not existing_user:
        create_user(db_session, obj_in=user_in)

    # Log in to get access token
    login_data = {
        "username": "testuser@example.com",
        "password": "testpassword123",
    }
    response = client.post(
        f"{settings.API_V1_STR}/auth/login/access-token", data=login_data
    )
    
    assert response.status_code == 200, f"Login failed: {response.text}"
    token_data = response.json()
    access_token = token_data["access_token"]
    
    # Return headers dict with Bearer token
    return {"Authorization": f"Bearer {access_token}"}


@pytest.fixture()
def trainee_user(db_session) -> dict:
    """Create a test trainee user (lowest permission level)."""
    from app.auth.crud import get_user_by_email
    from app.crud.crud_trainee import trainee as crud_trainee
    
    email = "trainee@test.com"
    
    user_in = TraineeCreate(
        email=email,
        password="trainee123",
        first_name="Test",
        last_name="Trainee",
    )
    user = create_user(db_session, obj_in=user_in)
    # Update role to trainee (should be default)
    user.role = UserRole.TRAINEE
    db_session.commit()
    db_session.refresh(user)
    
    return {"email": email, "password": "trainee123", "id": user.id}


@pytest.fixture()
def trainer_user(db_session) -> dict:
    """Create a test trainer user (medium permission level)."""
    from app.auth.crud import get_user_by_email
    from app.crud.crud_trainee import trainee as crud_trainee
    
    email = "trainer@test.com"
    
    user_in = TraineeCreate(
        email=email,
        password="trainer123",
        first_name="Test",
        last_name="Trainer",
    )
    user = create_user(db_session, obj_in=user_in)
    # Update role to trainer
    user.role = UserRole.TRAINER
    db_session.commit()
    db_session.refresh(user)
    
    return {"email": email, "password": "trainer123", "id": user.id}


@pytest.fixture()
def admin_user(db_session) -> dict:
    """Create a test admin user (highest permission level)."""
    from app.auth.crud import get_user_by_email
    from app.crud.crud_trainee import trainee as crud_trainee
    
    email = "admin@test.com"
    
    user_in = TraineeCreate(
        email=email,
        password="admin123",
        first_name="Test",
        last_name="Admin",
    )
    user = create_user(db_session, obj_in=user_in)
    # Update role to admin
    user.role = UserRole.ADMIN
    db_session.commit()
    db_session.refresh(user)
    
    return {"email": email, "password": "admin123", "id": user.id}

@pytest.fixture()
def trainee_headers(client: TestClient, trainee_user: dict) -> dict[str, str]:
    """Get authentication headers for trainee user."""
    login_data = {
        "username": trainee_user["email"],
        "password": trainee_user["password"],
    }
    response = client.post(
        f"{settings.API_V1_STR}/auth/login/access-token", data=login_data
    )
    assert response.status_code == 200, f"Trainee login failed: {response.text}"
    token = response.json()["access_token"]
    return {"Authorization": f"Bearer {token}"}


@pytest.fixture()
def trainer_headers(client: TestClient, trainer_user: dict) -> dict[str, str]:
    """Get authentication headers for trainer user."""
    login_data = {
        "username": trainer_user["email"],
        "password": trainer_user["password"],
    }
    response = client.post(
        f"{settings.API_V1_STR}/auth/login/access-token", data=login_data
    )
    assert response.status_code == 200, f"Trainer login failed: {response.text}"
    token = response.json()["access_token"]
    return {"Authorization": f"Bearer {token}"}


@pytest.fixture()
def admin_headers(client: TestClient, admin_user: dict) -> dict[str, str]:
    """Get authentication headers for admin user."""
    login_data = {
        "username": admin_user["email"],
        "password": admin_user["password"],
    }
    response = client.post(
        f"{settings.API_V1_STR}/auth/login/access-token", data=login_data
    )
    assert response.status_code == 200, f"Admin login failed: {response.text}"
    token = response.json()["access_token"]
    return {"Authorization": f"Bearer {token}"}

