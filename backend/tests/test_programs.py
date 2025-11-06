from fastapi.testclient import TestClient
from sqlalchemy.orm import Session

from app.core.config import settings


# ============================================================================
# AUTHORIZATION TESTS - Role-Based Access Control
# ============================================================================

def test_create_program_as_trainer_succeeds(client: TestClient, db_session: Session, trainer_headers: dict[str, str], trainer_user: dict) -> None:
    """Trainer users can create programs."""
    payload = {"name": "Trainer Program", "description": "Created by trainer", "trainer_id": trainer_user["id"]}
    r = client.post(f"{settings.API_V1_STR}/programs/", json=payload, headers=trainer_headers)
    assert r.status_code == 200, r.text
    data = r.json()
    assert data["name"] == payload["name"]


def test_create_program_as_admin_succeeds(client: TestClient, db_session: Session, admin_headers: dict[str, str], admin_user: dict) -> None:
    """Admin users can create programs."""
    payload = {"name": "Admin Program", "description": "Created by admin", "trainer_id": admin_user["id"]}
    r = client.post(f"{settings.API_V1_STR}/programs/", json=payload, headers=admin_headers)
    assert r.status_code == 200, r.text
    data = r.json()
    assert data["name"] == payload["name"]


def test_create_program_as_trainee_forbidden(client: TestClient, db_session: Session, trainee_headers: dict[str, str]) -> None:
    """Trainee users cannot create programs (403 Forbidden)."""
    payload = {"name": "Should Fail", "description": "Trainee attempt", "trainer_id": 1}
    r = client.post(f"{settings.API_V1_STR}/programs/", json=payload, headers=trainee_headers)
    assert r.status_code == 403, r.text
    assert "Insufficient permissions" in r.json()["detail"]


def test_create_program_unauthenticated_unauthorized(client: TestClient, db_session: Session) -> None:
    """Unauthenticated requests cannot create programs (401 Unauthorized)."""
    payload = {"name": "Should Fail", "description": "Unauth attempt", "trainer_id": 1}
    r = client.post(f"{settings.API_V1_STR}/programs/", json=payload)
    assert r.status_code == 401, r.text


def test_read_programs_requires_authentication(client: TestClient, db_session: Session, trainer_headers: dict[str, str], trainer_user: dict) -> None:
    """Reading programs requires authentication."""
    # Create a program first
    client.post(f"{settings.API_V1_STR}/programs/", json={"name": "Auth Test", "description": "Test", "trainer_id": trainer_user["id"]}, headers=trainer_headers)
    
    # Try to read without auth - should fail
    r_unauth = client.get(f"{settings.API_V1_STR}/programs/?skip=0&limit=50")
    assert r_unauth.status_code == 401, r_unauth.text
    
    # Read with auth - should succeed
    r_auth = client.get(f"{settings.API_V1_STR}/programs/?skip=0&limit=50", headers=trainer_headers)
    assert r_auth.status_code == 200, r_auth.text


def test_read_program_detail_requires_authentication(client: TestClient, db_session: Session, trainer_headers: dict[str, str], trainer_user: dict) -> None:
    """Reading program details requires authentication."""
    # Create program
    create_response = client.post(f"{settings.API_V1_STR}/programs/", json={"name": "Detail Test", "description": "Test", "trainer_id": trainer_user["id"]}, headers=trainer_headers)
    created = create_response.json()
    
    # Try to read without auth - should fail
    r_unauth = client.get(f"{settings.API_V1_STR}/programs/{created['id']}")
    assert r_unauth.status_code == 401, r_unauth.text
    
    # Read with auth - should succeed
    r_auth = client.get(f"{settings.API_V1_STR}/programs/{created['id']}", headers=trainer_headers)
    assert r_auth.status_code == 200, r_auth.text


def test_update_program_as_trainer_succeeds(client: TestClient, db_session: Session, trainer_headers: dict[str, str], trainer_user: dict) -> None:
    """Trainer users can update programs."""
    # Create program
    create_response = client.post(f"{settings.API_V1_STR}/programs/", json={"name": "Original", "description": "Original desc", "trainer_id": trainer_user["id"]}, headers=trainer_headers)
    created = create_response.json()
    
    # Update
    update_payload = {"name": "Updated", "description": "Updated desc", "trainer_id": trainer_user["id"]}
    r = client.put(f"{settings.API_V1_STR}/programs/{created['id']}", json=update_payload, headers=trainer_headers)
    assert r.status_code == 200, r.text
    updated = r.json()
    assert updated["name"] == "Updated"


def test_update_program_as_admin_succeeds(client: TestClient, db_session: Session, admin_headers: dict[str, str], admin_user: dict) -> None:
    """Admin users can update programs."""
    # Create program
    create_response = client.post(f"{settings.API_V1_STR}/programs/", json={"name": "Admin Original", "description": "Original", "trainer_id": admin_user["id"]}, headers=admin_headers)
    created = create_response.json()
    
    # Update
    update_payload = {"name": "Admin Updated", "description": "Updated", "trainer_id": admin_user["id"]}
    r = client.put(f"{settings.API_V1_STR}/programs/{created['id']}", json=update_payload, headers=admin_headers)
    assert r.status_code == 200, r.text


def test_update_program_as_trainee_forbidden(client: TestClient, db_session: Session, trainer_headers: dict[str, str], trainee_headers: dict[str, str], trainer_user: dict) -> None:
    """Trainee users cannot update programs (403 Forbidden)."""
    # Create program as trainer
    create_response = client.post(f"{settings.API_V1_STR}/programs/", json={"name": "Test", "description": "Test", "trainer_id": trainer_user["id"]}, headers=trainer_headers)
    created = create_response.json()
    
    # Try to update as trainee
    update_payload = {"name": "Should Fail", "description": "Fail", "trainer_id": trainer_user["id"]}
    r = client.put(f"{settings.API_V1_STR}/programs/{created['id']}", json=update_payload, headers=trainee_headers)
    assert r.status_code == 403, r.text
    assert "Insufficient permissions" in r.json()["detail"]


def test_delete_program_as_trainer_succeeds(client: TestClient, db_session: Session, trainer_headers: dict[str, str], trainer_user: dict) -> None:
    """Trainer users can delete programs."""
    # Create program
    create_response = client.post(f"{settings.API_V1_STR}/programs/", json={"name": "To Delete", "description": "Delete me", "trainer_id": trainer_user["id"]}, headers=trainer_headers)
    created = create_response.json()
    
    # Delete
    r = client.delete(f"{settings.API_V1_STR}/programs/{created['id']}", headers=trainer_headers)
    assert r.status_code == 200, r.text


def test_delete_program_as_admin_succeeds(client: TestClient, db_session: Session, admin_headers: dict[str, str], admin_user: dict) -> None:
    """Admin users can delete programs."""
    # Create program
    create_response = client.post(f"{settings.API_V1_STR}/programs/", json={"name": "Admin Delete", "description": "Delete", "trainer_id": admin_user["id"]}, headers=admin_headers)
    created = create_response.json()
    
    # Delete
    r = client.delete(f"{settings.API_V1_STR}/programs/{created['id']}", headers=admin_headers)
    assert r.status_code == 200, r.text


def test_delete_program_as_trainee_forbidden(client: TestClient, db_session: Session, trainer_headers: dict[str, str], trainee_headers: dict[str, str], trainer_user: dict) -> None:
    """Trainee users cannot delete programs (403 Forbidden)."""
    # Create program as trainer
    create_response = client.post(f"{settings.API_V1_STR}/programs/", json={"name": "Test", "description": "Test", "trainer_id": trainer_user["id"]}, headers=trainer_headers)
    created = create_response.json()
    
    # Try to delete as trainee
    r = client.delete(f"{settings.API_V1_STR}/programs/{created['id']}", headers=trainee_headers)
    assert r.status_code == 403, r.text
    assert "Insufficient permissions" in r.json()["detail"]


# ============================================================================
# LEGACY TESTS (kept for backward compatibility)
# ============================================================================

def test_create_program(client: TestClient, db_session: Session, trainer_headers: dict[str, str], trainer_user: dict) -> None:
    payload = {"name": "Test Program", "description": "A test program", "trainer_id": trainer_user["id"]}
    r = client.post(f"{settings.API_V1_STR}/programs/", json=payload, headers=trainer_headers)
    assert r.status_code == 200, r.text
    data = r.json()
    assert data["name"] == payload["name"]
    assert data["description"] == payload["description"]
    assert "id" in data


def test_read_program(client: TestClient, db_session: Session, trainer_headers: dict[str, str], trainer_user: dict) -> None:
    # create first
    c = client.post(f"{settings.API_V1_STR}/programs/", json={"name": "Strength Program", "description": "Strength building", "trainer_id": trainer_user["id"]}, headers=trainer_headers)
    assert c.status_code == 200
    created = c.json()

    # read
    r = client.get(f"{settings.API_V1_STR}/programs/{created['id']}", headers=trainer_headers)
    assert r.status_code == 200
    got = r.json()
    assert got["id"] == created["id"]
    assert got["name"] == "Strength Program"


def test_read_programs(client: TestClient, db_session: Session, trainer_headers: dict[str, str], trainer_user: dict) -> None:
    # ensure a couple of programs exist
    client.post(f"{settings.API_V1_STR}/programs/", json={"name": "P1", "description": "Desc1", "trainer_id": trainer_user["id"]}, headers=trainer_headers)
    client.post(f"{settings.API_V1_STR}/programs/", json={"name": "P2", "description": "Desc2", "trainer_id": trainer_user["id"]}, headers=trainer_headers)

    r = client.get(f"{settings.API_V1_STR}/programs/?skip=0&limit=50", headers=trainer_headers)
    assert r.status_code == 200
    data = r.json()
    assert isinstance(data, list)
    assert any(p["name"] == "P1" for p in data)


def test_update_program(client: TestClient, db_session: Session, trainer_headers: dict[str, str], trainer_user: dict) -> None:
    # create
    c = client.post(f"{settings.API_V1_STR}/programs/", json={"name": "Old Name", "description": "Old Desc", "trainer_id": trainer_user["id"]}, headers=trainer_headers)
    created = c.json()

    # update
    new_data = {"name": "Updated Name", "description": "Updated Desc", "trainer_id": trainer_user["id"]}
    r = client.put(f"{settings.API_V1_STR}/programs/{created['id']}", json=new_data, headers=trainer_headers)
    assert r.status_code == 200
    updated = r.json()
    assert updated["name"] == "Updated Name"
    assert updated["description"] == "Updated Desc"


def test_delete_program(client: TestClient, db_session: Session, trainer_headers: dict[str, str], trainer_user: dict) -> None:
    # create
    c = client.post(f"{settings.API_V1_STR}/programs/", json={"name": "To Delete", "description": "Will be deleted", "trainer_id": trainer_user["id"]}, headers=trainer_headers)
    created = c.json()

    # delete
    r = client.delete(f"{settings.API_V1_STR}/programs/{created['id']}", headers=trainer_headers)
    assert r.status_code == 200

    # verify 404 after delete (authenticated request)
    r2 = client.get(f"{settings.API_V1_STR}/programs/{created['id']}", headers=trainer_headers)
    assert r2.status_code == 404
