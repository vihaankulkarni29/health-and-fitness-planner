from fastapi.testclient import TestClient
from sqlalchemy.orm import Session

from app.core.config import settings


def test_create_exercise(client: TestClient, db_session: Session, trainer_headers: dict[str, str]) -> None:
    payload = {"name": "Test Exercise", "description": "A test exercise", "video_url": "https://example.com/video"}
    r = client.post(f"{settings.API_V1_STR}/exercises/", json=payload, headers=trainer_headers)
    assert r.status_code == 200, r.text
    data = r.json()
    assert data["name"] == payload["name"]
    assert data["description"] == payload["description"]
    assert "id" in data


def test_create_exercise_duplicate_name_returns_400(client: TestClient, db_session: Session, trainer_headers: dict[str, str]) -> None:
    payload = {"name": "Unique Exercise", "description": "Desc"}
    r1 = client.post(f"{settings.API_V1_STR}/exercises/", json=payload, headers=trainer_headers)
    assert r1.status_code == 200

    r2 = client.post(f"{settings.API_V1_STR}/exercises/", json=payload, headers=trainer_headers)
    assert r2.status_code == 400


def test_read_exercise(client: TestClient, db_session: Session, trainer_headers: dict[str, str], auth_headers: dict[str, str]) -> None:
    # create first
    c = client.post(f"{settings.API_V1_STR}/exercises/", json={"name": "Squat", "description": "Leg exercise", "video_url": None}, headers=trainer_headers)
    assert c.status_code == 200
    created = c.json()

    # read
    r = client.get(f"{settings.API_V1_STR}/exercises/{created['id']}", headers=auth_headers)
    assert r.status_code == 200
    got = r.json()
    assert got["id"] == created["id"]
    assert got["name"] == "Squat"


def test_read_exercises(client: TestClient, db_session: Session, trainer_headers: dict[str, str], auth_headers: dict[str, str]) -> None:
    # ensure a couple of exercises exist
    client.post(f"{settings.API_V1_STR}/exercises/", json={"name": "E1", "description": "Desc1", "video_url": None}, headers=trainer_headers)
    client.post(f"{settings.API_V1_STR}/exercises/", json={"name": "E2", "description": "Desc2", "video_url": None}, headers=trainer_headers)

    r = client.get(f"{settings.API_V1_STR}/exercises/?skip=0&limit=50", headers=auth_headers)
    assert r.status_code == 200
    data = r.json()
    assert isinstance(data, list)
    assert any(e["name"] == "E1" for e in data)


def test_update_exercise(client: TestClient, db_session: Session, trainer_headers: dict[str, str]) -> None:
    # create
    c = client.post(f"{settings.API_V1_STR}/exercises/", json={"name": "OldName", "description": "Old", "video_url": None}, headers=trainer_headers)
    created = c.json()

    # update
    new_data = {"name": "UpdatedName", "description": "Updated", "video_url": "https://updated.com"}
    r = client.put(f"{settings.API_V1_STR}/exercises/{created['id']}", json=new_data, headers=trainer_headers)
    assert r.status_code == 200
    updated = r.json()
    assert updated["name"] == "UpdatedName"
    assert updated["description"] == "Updated"


def test_delete_exercise(client: TestClient, db_session: Session, trainer_headers: dict[str, str], auth_headers: dict[str, str]) -> None:
    # create
    c = client.post(f"{settings.API_V1_STR}/exercises/", json={"name": "ToDelete", "description": "Will be deleted", "video_url": None}, headers=trainer_headers)
    created = c.json()

    # delete
    r = client.delete(f"{settings.API_V1_STR}/exercises/{created['id']}", headers=trainer_headers)
    assert r.status_code == 200

    # verify 404 after delete
    r2 = client.get(f"{settings.API_V1_STR}/exercises/{created['id']}", headers=auth_headers)
    assert r2.status_code == 404
