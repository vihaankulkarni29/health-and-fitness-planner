from fastapi.testclient import TestClient
from sqlalchemy.orm import Session

from app.core.config import settings
from app.schemas.trainee import TraineeCreate
from app.auth.crud import create_user


def test_login_access_token(client: TestClient, db_session: Session) -> None:
    # First, create a user to log in with
    user_in = TraineeCreate(
        email="test@example.com",
        password="testpassword",
        first_name="Test",
        last_name="User",
    )
    create_user(db_session, obj_in=user_in)

    # Now, try to log in
    login_data = {
        "username": "test@example.com",
        "password": "testpassword",
    }
    response = client.post(
        f"{settings.API_V1_STR}/auth/login/access-token", data=login_data
    )

    # Check that the login was successful
    assert response.status_code == 200
    token = response.json()
    assert "access_token" in token
    assert token["token_type"] == "bearer"
