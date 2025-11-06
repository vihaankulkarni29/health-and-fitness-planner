from fastapi.testclient import TestClient
from sqlalchemy.orm import Session

from app.core.config import settings


# ============================================================================
# AUTHORIZATION TESTS - Role-Based Access Control
# ============================================================================

def test_create_trainer_as_admin_succeeds(client: TestClient, db_session: Session, admin_headers: dict[str, str]) -> None:
    """Admin users can create trainers."""
    payload = {"first_name": "Admin", "last_name": "Created", "email": "admin.created@example.com", "gym_id": None}
    r = client.post(f"{settings.API_V1_STR}/trainers/", json=payload, headers=admin_headers)
    assert r.status_code == 200, r.text
    data = r.json()
    assert data["first_name"] == payload["first_name"]
    assert data["email"] == payload["email"]


def test_create_trainer_as_trainer_forbidden(client: TestClient, db_session: Session, trainer_headers: dict[str, str]) -> None:
    """Trainer users cannot create trainers (403 Forbidden)."""
    payload = {"first_name": "Should", "last_name": "Fail", "email": "trainer.fail@example.com", "gym_id": None}
    r = client.post(f"{settings.API_V1_STR}/trainers/", json=payload, headers=trainer_headers)
    assert r.status_code == 403, r.text
    assert "Insufficient permissions" in r.json()["detail"]


def test_create_trainer_as_trainee_forbidden(client: TestClient, db_session: Session, trainee_headers: dict[str, str]) -> None:
    """Trainee users cannot create trainers (403 Forbidden)."""
    payload = {"first_name": "Should", "last_name": "Fail", "email": "trainee.fail@example.com", "gym_id": None}
    r = client.post(f"{settings.API_V1_STR}/trainers/", json=payload, headers=trainee_headers)
    assert r.status_code == 403, r.text
    assert "Insufficient permissions" in r.json()["detail"]


def test_create_trainer_unauthenticated_unauthorized(client: TestClient, db_session: Session) -> None:
    """Unauthenticated requests cannot create trainers (401 Unauthorized)."""
    payload = {"first_name": "Should", "last_name": "Fail", "email": "unauth.fail@example.com", "gym_id": None}
    r = client.post(f"{settings.API_V1_STR}/trainers/", json=payload)
    assert r.status_code == 401, r.text


def test_update_trainer_as_admin_succeeds(client: TestClient, db_session: Session, admin_headers: dict[str, str]) -> None:
    """Admin users can update trainers."""
    # Create trainer first
    create_payload = {"first_name": "Original", "last_name": "Name", "email": "update.test@example.com", "gym_id": None}
    create_response = client.post(f"{settings.API_V1_STR}/trainers/", json=create_payload, headers=admin_headers)
    created = create_response.json()
    
    # Update
    update_payload = {"first_name": "Updated", "last_name": "Name", "email": "update.test@example.com", "gym_id": None}
    r = client.put(f"{settings.API_V1_STR}/trainers/{created['id']}", json=update_payload, headers=admin_headers)
    assert r.status_code == 200, r.text
    updated = r.json()
    assert updated["first_name"] == "Updated"


def test_update_trainer_as_trainer_forbidden(client: TestClient, db_session: Session, admin_headers: dict[str, str], trainer_headers: dict[str, str]) -> None:
    """Trainer users cannot update trainers (403 Forbidden)."""
    # Create trainer as admin
    create_payload = {"first_name": "Test", "last_name": "Trainer", "email": "trainer.update@example.com", "gym_id": None}
    create_response = client.post(f"{settings.API_V1_STR}/trainers/", json=create_payload, headers=admin_headers)
    created = create_response.json()
    
    # Try to update as trainer
    update_payload = {"first_name": "Should", "last_name": "Fail", "email": "trainer.update@example.com", "gym_id": None}
    r = client.put(f"{settings.API_V1_STR}/trainers/{created['id']}", json=update_payload, headers=trainer_headers)
    assert r.status_code == 403, r.text
    assert "Insufficient permissions" in r.json()["detail"]


def test_update_trainer_as_trainee_forbidden(client: TestClient, db_session: Session, admin_headers: dict[str, str], trainee_headers: dict[str, str]) -> None:
    """Trainee users cannot update trainers (403 Forbidden)."""
    # Create trainer as admin
    create_payload = {"first_name": "Test", "last_name": "Trainer", "email": "trainee.update@example.com", "gym_id": None}
    create_response = client.post(f"{settings.API_V1_STR}/trainers/", json=create_payload, headers=admin_headers)
    created = create_response.json()
    
    # Try to update as trainee
    update_payload = {"first_name": "Should", "last_name": "Fail", "email": "trainee.update@example.com", "gym_id": None}
    r = client.put(f"{settings.API_V1_STR}/trainers/{created['id']}", json=update_payload, headers=trainee_headers)
    assert r.status_code == 403, r.text
    assert "Insufficient permissions" in r.json()["detail"]


def test_delete_trainer_as_admin_succeeds(client: TestClient, db_session: Session, admin_headers: dict[str, str]) -> None:
    """Admin users can delete trainers."""
    # Create trainer
    create_payload = {"first_name": "To", "last_name": "Delete", "email": "delete.test@example.com", "gym_id": None}
    create_response = client.post(f"{settings.API_V1_STR}/trainers/", json=create_payload, headers=admin_headers)
    created = create_response.json()
    
    # Delete
    r = client.delete(f"{settings.API_V1_STR}/trainers/{created['id']}", headers=admin_headers)
    assert r.status_code == 200, r.text
    
    # Verify 404
    r2 = client.get(f"{settings.API_V1_STR}/trainers/{created['id']}")
    assert r2.status_code == 404


def test_delete_trainer_as_trainer_forbidden(client: TestClient, db_session: Session, admin_headers: dict[str, str], trainer_headers: dict[str, str]) -> None:
    """Trainer users cannot delete trainers (403 Forbidden)."""
    # Create trainer as admin
    create_payload = {"first_name": "Test", "last_name": "Delete", "email": "trainer.delete@example.com", "gym_id": None}
    create_response = client.post(f"{settings.API_V1_STR}/trainers/", json=create_payload, headers=admin_headers)
    created = create_response.json()
    
    # Try to delete as trainer
    r = client.delete(f"{settings.API_V1_STR}/trainers/{created['id']}", headers=trainer_headers)
    assert r.status_code == 403, r.text
    assert "Insufficient permissions" in r.json()["detail"]


def test_delete_trainer_as_trainee_forbidden(client: TestClient, db_session: Session, admin_headers: dict[str, str], trainee_headers: dict[str, str]) -> None:
    """Trainee users cannot delete trainers (403 Forbidden)."""
    # Create trainer as admin
    create_payload = {"first_name": "Test", "last_name": "Delete", "email": "trainee.delete@example.com", "gym_id": None}
    create_response = client.post(f"{settings.API_V1_STR}/trainers/", json=create_payload, headers=admin_headers)
    created = create_response.json()
    
    # Try to delete as trainee
    r = client.delete(f"{settings.API_V1_STR}/trainers/{created['id']}", headers=trainee_headers)
    assert r.status_code == 403, r.text
    assert "Insufficient permissions" in r.json()["detail"]


def test_read_trainers_public_access(client: TestClient, db_session: Session, admin_headers: dict[str, str]) -> None:
    """Reading trainers list is public (no auth required)."""
    # Create some trainers
    client.post(f"{settings.API_V1_STR}/trainers/", json={"first_name": "Public1", "last_name": "Trainer", "email": "pub1@example.com", "gym_id": None}, headers=admin_headers)
    client.post(f"{settings.API_V1_STR}/trainers/", json={"first_name": "Public2", "last_name": "Trainer", "email": "pub2@example.com", "gym_id": None}, headers=admin_headers)
    
    # Read without authentication
    r = client.get(f"{settings.API_V1_STR}/trainers/?skip=0&limit=50")
    assert r.status_code == 200, r.text
    data = r.json()
    assert isinstance(data, list)
    assert len(data) >= 2


def test_read_trainer_detail_public_access(client: TestClient, db_session: Session, admin_headers: dict[str, str]) -> None:
    """Reading trainer details is public (no auth required)."""
    # Create trainer
    create_response = client.post(f"{settings.API_V1_STR}/trainers/", json={"first_name": "Public", "last_name": "Detail", "email": "pub.detail@example.com", "gym_id": None}, headers=admin_headers)
    created = create_response.json()
    
    # Read without authentication
    r = client.get(f"{settings.API_V1_STR}/trainers/{created['id']}")
    assert r.status_code == 200, r.text
    data = r.json()
    assert data["email"] == "pub.detail@example.com"


# ============================================================================
# LEGACY TESTS (kept for backward compatibility)
# ============================================================================

def test_create_trainer(client: TestClient, db_session: Session, admin_headers: dict[str, str]) -> None:
    payload = {"first_name": "John", "last_name": "Doe", "email": "john.doe@example.com", "gym_id": None}
    r = client.post(f"{settings.API_V1_STR}/trainers/", json=payload, headers=admin_headers)
    assert r.status_code == 200, r.text
    data = r.json()
    assert data["first_name"] == payload["first_name"]
    assert data["email"] == payload["email"]
    assert "id" in data


def test_read_trainer(client: TestClient, db_session: Session, admin_headers: dict[str, str]) -> None:
    # create first
    c = client.post(f"{settings.API_V1_STR}/trainers/", json={"first_name": "Alice", "last_name": "Smith", "email": "alice@example.com", "gym_id": None}, headers=admin_headers)
    assert c.status_code == 200
    created = c.json()

    # read
    r = client.get(f"{settings.API_V1_STR}/trainers/{created['id']}")
    assert r.status_code == 200
    got = r.json()
    assert got["id"] == created["id"]
    assert got["email"] == "alice@example.com"


def test_read_trainers(client: TestClient, db_session: Session, admin_headers: dict[str, str]) -> None:
    # ensure a couple of trainers exist
    client.post(f"{settings.API_V1_STR}/trainers/", json={"first_name": "T1", "last_name": "L1", "email": "t1@example.com", "gym_id": None}, headers=admin_headers)
    client.post(f"{settings.API_V1_STR}/trainers/", json={"first_name": "T2", "last_name": "L2", "email": "t2@example.com", "gym_id": None}, headers=admin_headers)

    r = client.get(f"{settings.API_V1_STR}/trainers/?skip=0&limit=50")
    assert r.status_code == 200
    data = r.json()
    assert isinstance(data, list)
    assert any(t["email"] == "t1@example.com" for t in data)


def test_update_trainer(client: TestClient, db_session: Session, admin_headers: dict[str, str]) -> None:
    # create
    c = client.post(f"{settings.API_V1_STR}/trainers/", json={"first_name": "Upd", "last_name": "Me", "email": "upd@example.com", "gym_id": None}, headers=admin_headers)
    created = c.json()

    # update
    new_data = {"first_name": "Updated", "last_name": "Name", "email": "upd@example.com", "gym_id": None}
    r = client.put(f"{settings.API_V1_STR}/trainers/{created['id']}", json=new_data, headers=admin_headers)
    assert r.status_code == 200
    updated = r.json()
    assert updated["first_name"] == "Updated"
    assert updated["last_name"] == "Name"


def test_delete_trainer(client: TestClient, db_session: Session, admin_headers: dict[str, str]) -> None:
    # create
    c = client.post(f"{settings.API_V1_STR}/trainers/", json={"first_name": "Del", "last_name": "Me", "email": "del@example.com", "gym_id": None}, headers=admin_headers)
    created = c.json()

    # delete
    r = client.delete(f"{settings.API_V1_STR}/trainers/{created['id']}", headers=admin_headers)
    assert r.status_code == 200

    # verify 404 after delete
    r2 = client.get(f"{settings.API_V1_STR}/trainers/{created['id']}")
    assert r2.status_code == 404
