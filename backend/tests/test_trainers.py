from fastapi.testclient import TestClient
from sqlalchemy.orm import Session

from app.core.config import settings


def test_create_trainer(client: TestClient, db_session: Session, auth_headers: dict[str, str]) -> None:
    payload = {"first_name": "John", "last_name": "Doe", "email": "john.doe@example.com", "gym_id": None}
    r = client.post(f"{settings.API_V1_STR}/trainers/", json=payload, headers=auth_headers)
    assert r.status_code == 200, r.text
    data = r.json()
    assert data["first_name"] == payload["first_name"]
    assert data["email"] == payload["email"]
    assert "id" in data


def test_read_trainer(client: TestClient, db_session: Session, auth_headers: dict[str, str]) -> None:
    # create first
    c = client.post(f"{settings.API_V1_STR}/trainers/", json={"first_name": "Alice", "last_name": "Smith", "email": "alice@example.com", "gym_id": None}, headers=auth_headers)
    assert c.status_code == 200
    created = c.json()

    # read
    r = client.get(f"{settings.API_V1_STR}/trainers/{created['id']}")
    assert r.status_code == 200
    got = r.json()
    assert got["id"] == created["id"]
    assert got["email"] == "alice@example.com"


def test_read_trainers(client: TestClient, db_session: Session, auth_headers: dict[str, str]) -> None:
    # ensure a couple of trainers exist
    client.post(f"{settings.API_V1_STR}/trainers/", json={"first_name": "T1", "last_name": "L1", "email": "t1@example.com", "gym_id": None}, headers=auth_headers)
    client.post(f"{settings.API_V1_STR}/trainers/", json={"first_name": "T2", "last_name": "L2", "email": "t2@example.com", "gym_id": None}, headers=auth_headers)

    r = client.get(f"{settings.API_V1_STR}/trainers/?skip=0&limit=50")
    assert r.status_code == 200
    data = r.json()
    assert isinstance(data, list)
    assert any(t["email"] == "t1@example.com" for t in data)


def test_update_trainer(client: TestClient, db_session: Session, auth_headers: dict[str, str]) -> None:
    # create
    c = client.post(f"{settings.API_V1_STR}/trainers/", json={"first_name": "Upd", "last_name": "Me", "email": "upd@example.com", "gym_id": None}, headers=auth_headers)
    created = c.json()

    # update
    new_data = {"first_name": "Updated", "last_name": "Name", "email": "upd@example.com", "gym_id": None}
    r = client.put(f"{settings.API_V1_STR}/trainers/{created['id']}", json=new_data, headers=auth_headers)
    assert r.status_code == 200
    updated = r.json()
    assert updated["first_name"] == "Updated"
    assert updated["last_name"] == "Name"


def test_delete_trainer(client: TestClient, db_session: Session, auth_headers: dict[str, str]) -> None:
    # create
    c = client.post(f"{settings.API_V1_STR}/trainers/", json={"first_name": "Del", "last_name": "Me", "email": "del@example.com", "gym_id": None}, headers=auth_headers)
    created = c.json()

    # delete
    r = client.delete(f"{settings.API_V1_STR}/trainers/{created['id']}", headers=auth_headers)
    assert r.status_code == 200

    # verify 404 after delete
    r2 = client.get(f"{settings.API_V1_STR}/trainers/{created['id']}")
    assert r2.status_code == 404
