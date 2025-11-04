from fastapi.testclient import TestClient
from sqlalchemy.orm import Session

from app.core.config import settings
from app.schemas.gym import GymCreate


def test_create_gym(client: TestClient, db_session: Session, auth_headers: dict[str, str]) -> None:
    data = {"name": "Test Gym", "address": "123 Test St"}
    response = client.post(
        f"{settings.API_V1_STR}/gyms/",
        json=data,
        headers=auth_headers,
    )
    assert response.status_code == 200
    content = response.json()
    assert content["name"] == data["name"]
    assert content["address"] == data["address"]
    assert "id" in content


def test_read_gym(client: TestClient, db_session: Session, auth_headers: dict[str, str]) -> None:
    data = {"name": "Test Gym 2", "address": "456 Test Ave"}
    response = client.post(
        f"{settings.API_V1_STR}/gyms/",
        json=data,
        headers=auth_headers,
    )
    assert response.status_code == 200
    content = response.json()
    gym_id = content["id"]

    response = client.get(f"{settings.API_V1_STR}/gyms/{gym_id}")
    assert response.status_code == 200
    content = response.json()
    assert content["name"] == data["name"]
    assert content["address"] == data["address"]
    assert content["id"] == gym_id


def test_read_gyms(client: TestClient, db_session: Session, auth_headers: dict[str, str]) -> None:
    data = {"name": "Test Gym 3", "address": "789 Test Rd"}
    client.post(f"{settings.API_V1_STR}/gyms/", json=data, headers=auth_headers)
    data = {"name": "Test Gym 4", "address": "101 Test Ln"}
    client.post(f"{settings.API_V1_STR}/gyms/", json=data, headers=auth_headers)

    response = client.get(f"{settings.API_V1_STR}/gyms/")
    assert response.status_code == 200
    content = response.json()
    assert len(content) >= 2


def test_update_gym(client: TestClient, db_session: Session, auth_headers: dict[str, str]) -> None:
    data = {"name": "Test Gym 5", "address": "111 Update St"}
    response = client.post(
        f"{settings.API_V1_STR}/gyms/",
        json=data,
        headers=auth_headers,
    )
    assert response.status_code == 200
    content = response.json()
    gym_id = content["id"]

    update_data = {"name": "Updated Gym 5", "address": "222 New Ave"}
    response = client.put(
        f"{settings.API_V1_STR}/gyms/{gym_id}",
        json=update_data,
        headers=auth_headers,
    )
    assert response.status_code == 200
    content = response.json()
    assert content["name"] == update_data["name"]
    assert content["address"] == update_data["address"]
    assert content["id"] == gym_id


def test_delete_gym(client: TestClient, db_session: Session, auth_headers: dict[str, str]) -> None:
    data = {"name": "Test Gym 6", "address": "333 Delete Rd"}
    response = client.post(
        f"{settings.API_V1_STR}/gyms/",
        json=data,
        headers=auth_headers,
    )
    assert response.status_code == 200
    content = response.json()
    gym_id = content["id"]

    response = client.delete(f"{settings.API_V1_STR}/gyms/{gym_id}", headers=auth_headers)
    assert response.status_code == 200
    content = response.json()
    assert content["id"] == gym_id

    response = client.get(f"{settings.API_V1_STR}/gyms/{gym_id}")
    assert response.status_code == 404
