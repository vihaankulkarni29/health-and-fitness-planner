from fastapi.testclient import TestClient
from sqlalchemy.orm import Session

from app.core.config import settings


def test_create_trainee(client: TestClient, db_session: Session, auth_headers: dict[str, str]) -> None:
    payload = {"first_name": "Jane", "last_name": "Doe", "email": "jane.doe@example.com", "gym_id": None, "trainer_id": None, "program_id": None, "password": "testpass123"}
    r = client.post(f"{settings.API_V1_STR}/trainees/", json=payload, headers=auth_headers)
    assert r.status_code == 200, r.text
    data = r.json()
    assert data["first_name"] == payload["first_name"]
    assert data["email"] == payload["email"]
    assert "id" in data


def test_read_trainee(client: TestClient, db_session: Session, trainer_headers: dict[str, str], auth_headers: dict[str, str]) -> None:
    # create first
    c = client.post(f"{settings.API_V1_STR}/trainees/", json={"first_name": "Alice", "last_name": "Smith", "email": "alice.t@example.com", "gym_id": None, "trainer_id": None, "program_id": None, "password": "testpass123"}, headers=auth_headers)
    assert c.status_code == 200
    created = c.json()

    # read
    r = client.get(f"{settings.API_V1_STR}/trainees/{created['id']}", headers=trainer_headers)
    assert r.status_code == 200
    got = r.json()
    assert got["id"] == created["id"]
    assert got["email"] == "alice.t@example.com"


def test_read_trainees(client: TestClient, db_session: Session, trainer_headers: dict[str, str], auth_headers: dict[str, str]) -> None:
    # ensure a couple of trainees exist
    client.post(f"{settings.API_V1_STR}/trainees/", json={"first_name": "T1", "last_name": "L1", "email": "t1.t@example.com", "gym_id": None, "trainer_id": None, "program_id": None, "password": "testpass123"}, headers=auth_headers)
    client.post(f"{settings.API_V1_STR}/trainees/", json={"first_name": "T2", "last_name": "L2", "email": "t2.t@example.com", "gym_id": None, "trainer_id": None, "program_id": None, "password": "testpass123"}, headers=auth_headers)

    r = client.get(f"{settings.API_V1_STR}/trainees/?skip=0&limit=50", headers=trainer_headers)
    assert r.status_code == 200
    data = r.json()
    assert isinstance(data, list)
    assert any(t["email"] == "t1.t@example.com" for t in data)


def test_update_trainee(client: TestClient, db_session: Session, trainer_headers: dict[str, str]) -> None:
    # create
    c = client.post(f"{settings.API_V1_STR}/trainees/", json={"first_name": "Upd", "last_name": "Me", "email": "upd.t@example.com", "gym_id": None, "trainer_id": None, "program_id": None, "password": "testpass123"})
    created = c.json()

    # update
    new_data = {"first_name": "Updated", "last_name": "Name", "email": "upd.t@example.com", "gym_id": None, "trainer_id": None, "program_id": None}
    r = client.put(f"{settings.API_V1_STR}/trainees/{created['id']}", json=new_data, headers=trainer_headers)
    assert r.status_code == 200
    updated = r.json()
    assert updated["first_name"] == "Updated"
    assert updated["last_name"] == "Name"


def test_delete_trainee(client: TestClient, db_session: Session, admin_headers: dict[str, str]) -> None:
    # create
    c = client.post(f"{settings.API_V1_STR}/trainees/", json={"first_name": "Del", "last_name": "Me", "email": "del.t@example.com", "gym_id": None, "trainer_id": None, "program_id": None, "password": "testpass123"})
    created = c.json()

    # delete
    r = client.delete(f"{settings.API_V1_STR}/trainees/{created['id']}", headers=admin_headers)
    assert r.status_code == 200

    # verify 404 after delete
    r2 = client.get(f"{settings.API_V1_STR}/trainees/{created['id']}", headers=admin_headers)
    assert r2.status_code == 404


def test_assign_program_to_trainee(client: TestClient, db_session: Session, trainer_headers: dict[str, str], trainer_user: dict) -> None:
    # Create a program (trainer required)
    program_payload = {"name": "Test Program", "description": "A program for testing", "trainer_id": trainer_user["id"]}
    program_response = client.post(f"{settings.API_V1_STR}/programs/", json=program_payload, headers=trainer_headers)
    assert program_response.status_code == 200
    program = program_response.json()

    # Create a trainee
    trainee_payload = {"first_name": "Assign", "last_name": "Me", "email": "assign.me@example.com", "gym_id": None, "trainer_id": None, "program_id": None, "password": "testpass123"}
    trainee_response = client.post(f"{settings.API_V1_STR}/trainees/", json=trainee_payload)
    assert trainee_response.status_code == 200
    trainee = trainee_response.json()

    # Assign the program to the trainee
    assign_response = client.put(f"{settings.API_V1_STR}/trainees/{trainee['id']}/assign-program/{program['id']}", headers=trainer_headers)
    assert assign_response.status_code == 200
    updated_trainee = assign_response.json()
    assert updated_trainee["program_id"] == program["id"]


def test_assign_program_to_nonexistent_trainee(client: TestClient, db_session: Session, trainer_headers: dict[str, str], trainer_user: dict) -> None:
    # Create a program (trainer required)
    program_payload = {"name": "Test Program 2", "description": "Another program for testing", "trainer_id": trainer_user["id"]}
    program_response = client.post(f"{settings.API_V1_STR}/programs/", json=program_payload, headers=trainer_headers)
    assert program_response.status_code == 200
    program = program_response.json()

    # Try to assign to a non-existent trainee
    non_existent_trainee_id = 99999
    assign_response = client.put(f"{settings.API_V1_STR}/trainees/{non_existent_trainee_id}/assign-program/{program['id']}", headers=trainer_headers)
    assert assign_response.status_code == 404
    assert "Trainee not found" in assign_response.json()["detail"]


def test_assign_nonexistent_program_to_trainee(client: TestClient, db_session: Session, trainer_headers: dict[str, str]) -> None:
    # Create a trainee
    trainee_payload = {"first_name": "Assign", "last_name": "Fail", "email": "assign.fail@example.com", "gym_id": None, "trainer_id": None, "program_id": None, "password": "testpass123"}
    trainee_response = client.post(f"{settings.API_V1_STR}/trainees/", json=trainee_payload)
    assert trainee_response.status_code == 200
    trainee = trainee_response.json()

    # Try to assign a non-existent program
    non_existent_program_id = 99999
    assign_response = client.put(f"{settings.API_V1_STR}/trainees/{trainee['id']}/assign-program/{non_existent_program_id}", headers=trainer_headers)
    assert assign_response.status_code == 404
    assert "Program not found" in assign_response.json()["detail"]
