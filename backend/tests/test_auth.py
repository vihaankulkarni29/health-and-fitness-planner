import pytest
from fastapi.testclient import TestClient
from sqlalchemy.orm import Session

from app.core.config import settings
from app.schemas.trainee import TraineeCreate
from app.auth.crud import create_user


@pytest.fixture(scope="function")
def test_user(db_session: Session) -> None:
    """Fixture to create a user for login tests."""
    user_in = TraineeCreate(
        email="test@example.com",
        password="testpassword",
        first_name="Test",
        last_name="User",
    )
    create_user(db_session, obj_in=user_in)


def test_login_access_token(client: TestClient, test_user: None) -> None:
    """Test successful login and token generation."""
    login_data = {
        "username": "test@example.com",
        "password": "testpassword",
    }
    response = client.post(
        f"{settings.API_V1_STR}/auth/login/access-token", data=login_data
    )
    assert response.status_code == 200
    token = response.json()
    assert "access_token" in token
    assert token["token_type"] == "bearer"


def test_login_incorrect_password(client: TestClient, test_user: None) -> None:
    """Test login with an incorrect password."""
    login_data = {
        "username": "test@example.com",
        "password": "wrongpassword",
    }
    response = client.post(
        f"{settings.API_V1_STR}/auth/login/access-token", data=login_data
    )
    assert response.status_code == 401
    assert response.json() == {"detail": "Incorrect email or password"}


def test_login_nonexistent_user(client: TestClient) -> None:
    """Test login with a username that does not exist."""
    login_data = {
        "username": "nonexistent@example.com",
        "password": "anypassword",
    }
    response = client.post(
        f"{settings.API_V1_STR}/auth/login/access-token", data=login_data
    )
    assert response.status_code == 401
    assert response.json() == {"detail": "Incorrect email or password"}


def test_login_malformed_payload(client: TestClient) -> None:
    """Test login with a malformed payload (e.g., 'email' instead of 'username')."""
    # The endpoint expects 'username' and 'password' from an OAuth2PasswordRequestForm
    malformed_data = {
        "email": "test@example.com",  # Incorrect key
        "password": "testpassword",
    }
    response = client.post(
        f"{settings.API_V1_STR}/auth/login/access-token", data=malformed_data
    )
    assert response.status_code == 422
    error = response.json()
    assert "detail" in error
    assert error["detail"][0]["msg"] == "Field required"
    assert error["detail"][0]["loc"] == ["body", "username"]
