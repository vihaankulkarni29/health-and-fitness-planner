from fastapi.testclient import TestClient
from sqlalchemy.orm import Session

from app.core.config import settings
from app.schemas.program_exercise import ProgramExerciseCreate, ProgramExerciseUpdate
from app.crud.crud_program_exercise import program_exercise as crud_program_exercise
from app.crud.crud_program import program as crud_program
from app.crud.crud_exercise import exercise as crud_exercise


def test_create_program_exercise(client: TestClient, db_session: Session, trainer_headers: dict[str, str]) -> None:
    # Create a program and an exercise to associate the program exercise with
    program_in = {"name": "Test Program", "description": "Test Description"}
    program = crud_program.create(db_session, obj_in=program_in)
    exercise_in = {"name": "Test Exercise", "description": "Test Description"}
    exercise = crud_exercise.create(db_session, obj_in=exercise_in)

    data = {"program_id": program.id, "exercise_id": exercise.id, "order": 1, "prescribed_sets": 3, "prescribed_reps": 10, "prescribed_weight_kg": 50}
    response = client.post(
        f"{settings.API_V1_STR}/program_exercises/",
        json=data,
        headers=trainer_headers,
    )
    assert response.status_code == 200
    content = response.json()
    assert content["program_id"] == data["program_id"]
    assert content["exercise_id"] == data["exercise_id"]
    assert content["order"] == data["order"]
    assert "id" in content


def test_read_program_exercise(client: TestClient, db_session: Session, auth_headers: dict[str, str]) -> None:
    program_in = {"name": "Test Program 2", "description": "Test Description"}
    program = crud_program.create(db_session, obj_in=program_in)
    exercise_in = {"name": "Test Exercise 2", "description": "Test Description"}
    exercise = crud_exercise.create(db_session, obj_in=exercise_in)
    program_exercise_in = ProgramExerciseCreate(program_id=program.id, exercise_id=exercise.id, order=1)
    program_exercise = crud_program_exercise.create(db_session, obj_in=program_exercise_in)

    response = client.get(f"{settings.API_V1_STR}/program_exercises/{program_exercise.id}", headers=auth_headers)
    assert response.status_code == 200
    content = response.json()
    assert content["program_id"] == program_exercise.program_id
    assert content["exercise_id"] == program_exercise.exercise_id
    assert content["order"] == program_exercise.order
    assert content["id"] == program_exercise.id


def test_read_program_exercises(client: TestClient, db_session: Session, auth_headers: dict[str, str]) -> None:
    response = client.get(f"{settings.API_V1_STR}/program_exercises/", headers=auth_headers)
    assert response.status_code == 200
    content = response.json()
    assert isinstance(content, list)


def test_update_program_exercise(client: TestClient, db_session: Session, trainer_headers: dict[str, str]) -> None:
    program_in = {"name": "Test Program 3", "description": "Test Description"}
    program = crud_program.create(db_session, obj_in=program_in)
    exercise_in = {"name": "Test Exercise 3", "description": "Test Description"}
    exercise = crud_exercise.create(db_session, obj_in=exercise_in)
    program_exercise_in = ProgramExerciseCreate(program_id=program.id, exercise_id=exercise.id, order=1)
    program_exercise = crud_program_exercise.create(db_session, obj_in=program_exercise_in)

    data = {"order": 2}
    response = client.put(
        f"{settings.API_V1_STR}/program_exercises/{program_exercise.id}",
        json=data,
        headers=trainer_headers,
    )
    assert response.status_code == 200
    content = response.json()
    assert content["order"] == data["order"]
    assert content["id"] == program_exercise.id


def test_delete_program_exercise(client: TestClient, db_session: Session, trainer_headers: dict[str, str], auth_headers: dict[str, str]) -> None:
    program_in = {"name": "Test Program 4", "description": "Test Description"}
    program = crud_program.create(db_session, obj_in=program_in)
    exercise_in = {"name": "Test Exercise 4", "description": "Test Description"}
    exercise = crud_exercise.create(db_session, obj_in=exercise_in)
    program_exercise_in = ProgramExerciseCreate(program_id=program.id, exercise_id=exercise.id, order=1)
    program_exercise = crud_program_exercise.create(db_session, obj_in=program_exercise_in)

    response = client.delete(f"{settings.API_V1_STR}/program_exercises/{program_exercise.id}", headers=trainer_headers)
    assert response.status_code == 200
    content = response.json()
    assert content["id"] == program_exercise.id

    response = client.get(f"{settings.API_V1_STR}/program_exercises/{program_exercise.id}", headers=auth_headers)
    assert response.status_code == 404
