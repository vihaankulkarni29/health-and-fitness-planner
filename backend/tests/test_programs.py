from fastapi.testclient import TestClient
from sqlalchemy.orm import Session

from app.core.config import settings


def test_create_program(client: TestClient, db_session: Session, auth_headers: dict[str, str]) -> None:
    payload = {"name": "Test Program", "description": "A test program", "trainer_id": 1}
    r = client.post(f"{settings.API_V1_STR}/programs/", json=payload, headers=auth_headers)
    assert r.status_code == 200, r.text
    data = r.json()
    assert data["name"] == payload["name"]
    assert data["description"] == payload["description"]
    assert "id" in data


def test_read_program(client: TestClient, db_session: Session, auth_headers: dict[str, str]) -> None:
    # create first
    c = client.post(f"{settings.API_V1_STR}/programs/", json={"name": "Strength Program", "description": "Strength building", "trainer_id": 1}, headers=auth_headers)
    assert c.status_code == 200
    created = c.json()

    # read
    r = client.get(f"{settings.API_V1_STR}/programs/{created['id']}")
    assert r.status_code == 200
    got = r.json()
    assert got["id"] == created["id"]
    assert got["name"] == "Strength Program"


def test_read_programs(client: TestClient, db_session: Session, auth_headers: dict[str, str]) -> None:
    # ensure a couple of programs exist
    client.post(f"{settings.API_V1_STR}/programs/", json={"name": "P1", "description": "Desc1", "trainer_id": 1}, headers=auth_headers)
    client.post(f"{settings.API_V1_STR}/programs/", json={"name": "P2", "description": "Desc2", "trainer_id": 1}, headers=auth_headers)

    r = client.get(f"{settings.API_V1_STR}/programs/?skip=0&limit=50")
    assert r.status_code == 200
    data = r.json()
    assert isinstance(data, list)
    assert any(p["name"] == "P1" for p in data)


def test_update_program(client: TestClient, db_session: Session, auth_headers: dict[str, str]) -> None:
    # create
    c = client.post(f"{settings.API_V1_STR}/programs/", json={"name": "Old Name", "description": "Old Desc", "trainer_id": 1}, headers=auth_headers)
    created = c.json()

    # update
    new_data = {"name": "Updated Name", "description": "Updated Desc", "trainer_id": 1}
    r = client.put(f"{settings.API_V1_STR}/programs/{created['id']}", json=new_data, headers=auth_headers)
    assert r.status_code == 200
    updated = r.json()
    assert updated["name"] == "Updated Name"
    assert updated["description"] == "Updated Desc"


def test_delete_program(client: TestClient, db_session: Session, auth_headers: dict[str, str]) -> None:
    # create
    c = client.post(f"{settings.API_V1_STR}/programs/", json={"name": "To Delete", "description": "Will be deleted", "trainer_id": 1}, headers=auth_headers)
    created = c.json()

    # delete
    r = client.delete(f"{settings.API_V1_STR}/programs/{created['id']}", headers=auth_headers)
    assert r.status_code == 200

    # verify 404 after delete
    r2 = client.get(f"{settings.API_V1_STR}/programs/{created['id']}")
    assert r2.status_code == 404
