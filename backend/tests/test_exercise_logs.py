from datetime import date

from fastapi.testclient import TestClient
from sqlalchemy.orm import Session

from app.core.config import settings
from app.schemas.exercise_log import ExerciseLogCreate, ExerciseLogUpdate
from app.schemas.workout_session import WorkoutSessionBase
from app.crud.crud_exercise_log import exercise_log as crud_exercise_log
from app.crud.crud_workout_session import workout_session as crud_workout_session
from app.crud.crud_exercise import exercise as crud_exercise
from app.crud.crud_trainee import trainee as crud_trainee
from app.crud.crud_program import program as crud_program


def test_create_exercise_log(client: TestClient, db_session: Session, auth_headers: dict[str, str]) -> None:
    # Create a workout session and an exercise to associate the exercise log with
    trainee_in = {"first_name": "Test", "last_name": "Trainee", "email": "test.trainee.log@example.com"}
    trainee = crud_trainee.create(db_session, obj_in=trainee_in)
    program_in = {"name": "Test Program", "description": "Test Description"}
    program = crud_program.create(db_session, obj_in=program_in)
    workout_session_in = WorkoutSessionBase(trainee_id=trainee.id, program_id=program.id, session_date=date.today(), status="in-progress")
    workout_session = crud_workout_session.create(db_session, obj_in=workout_session_in)
    exercise_in = {"name": "Test Exercise", "description": "Test Description"}
    exercise = crud_exercise.create(db_session, obj_in=exercise_in)

    data = {"session_id": workout_session.id, "exercise_id": exercise.id, "completed_sets": 3, "completed_reps": 10, "completed_weight_kg": 50}
    response = client.post(
        f"{settings.API_V1_STR}/exercise_logs/",
        json=data,
        headers=auth_headers,
    )
    assert response.status_code == 200
    content = response.json()
    assert content["session_id"] == data["session_id"]
    assert content["exercise_id"] == data["exercise_id"]
    assert content["completed_sets"] == data["completed_sets"]
    assert "id" in content


def test_read_exercise_log(client: TestClient, db_session: Session, auth_headers: dict[str, str]) -> None:
    trainee_in = {"first_name": "Test", "last_name": "Trainee", "email": "test.trainee.log2@example.com"}
    trainee = crud_trainee.create(db_session, obj_in=trainee_in)
    program_in = {"name": "Test Program 2", "description": "Test Description"}
    program = crud_program.create(db_session, obj_in=program_in)
    workout_session_in = WorkoutSessionBase(trainee_id=trainee.id, program_id=program.id, session_date=date.today(), status="in-progress")
    workout_session = crud_workout_session.create(db_session, obj_in=workout_session_in)
    exercise_in = {"name": "Test Exercise 2", "description": "Test Description"}
    exercise = crud_exercise.create(db_session, obj_in=exercise_in)
    exercise_log_in = ExerciseLogCreate(session_id=workout_session.id, exercise_id=exercise.id)
    exercise_log = crud_exercise_log.create(db_session, obj_in=exercise_log_in)

    response = client.get(f"{settings.API_V1_STR}/exercise_logs/{exercise_log.id}")
    assert response.status_code == 200
    content = response.json()
    assert content["session_id"] == exercise_log.session_id
    assert content["exercise_id"] == exercise_log.exercise_id
    assert content["id"] == exercise_log.id


def test_read_exercise_logs(client: TestClient, db_session: Session) -> None:
    response = client.get(f"{settings.API_V1_STR}/exercise_logs/")
    assert response.status_code == 200
    content = response.json()
    assert isinstance(content, list)


def test_update_exercise_log(client: TestClient, db_session: Session, auth_headers: dict[str, str]) -> None:
    trainee_in = {"first_name": "Test", "last_name": "Trainee", "email": "test.trainee.log3@example.com"}
    trainee = crud_trainee.create(db_session, obj_in=trainee_in)
    program_in = {"name": "Test Program 3", "description": "Test Description"}
    program = crud_program.create(db_session, obj_in=program_in)
    workout_session_in = WorkoutSessionBase(trainee_id=trainee.id, program_id=program.id, session_date=date.today(), status="in-progress")
    workout_session = crud_workout_session.create(db_session, obj_in=workout_session_in)
    exercise_in = {"name": "Test Exercise 3", "description": "Test Description"}
    exercise = crud_exercise.create(db_session, obj_in=exercise_in)
    exercise_log_in = ExerciseLogCreate(session_id=workout_session.id, exercise_id=exercise.id)
    exercise_log = crud_exercise_log.create(db_session, obj_in=exercise_log_in)

    data = {"completed_reps": 12}
    response = client.put(
        f"{settings.API_V1_STR}/exercise_logs/{exercise_log.id}",
        json=data,
        headers=auth_headers,
    )
    assert response.status_code == 200
    content = response.json()
    assert content["completed_reps"] == data["completed_reps"]
    assert content["id"] == exercise_log.id


def test_delete_exercise_log(client: TestClient, db_session: Session, auth_headers: dict[str, str]) -> None:
    trainee_in = {"first_name": "Test", "last_name": "Trainee", "email": "test.trainee.log4@example.com"}
    trainee = crud_trainee.create(db_session, obj_in=trainee_in)
    program_in = {"name": "Test Program 4", "description": "Test Description"}
    program = crud_program.create(db_session, obj_in=program_in)
    workout_session_in = WorkoutSessionBase(trainee_id=trainee.id, program_id=program.id, session_date=date.today(), status="in-progress")
    workout_session = crud_workout_session.create(db_session, obj_in=workout_session_in)
    exercise_in = {"name": "Test Exercise 4", "description": "Test Description"}
    exercise = crud_exercise.create(db_session, obj_in=exercise_in)
    exercise_log_in = ExerciseLogCreate(session_id=workout_session.id, exercise_id=exercise.id)
    exercise_log = crud_exercise_log.create(db_session, obj_in=exercise_log_in)

    response = client.delete(f"{settings.API_V1_STR}/exercise_logs/{exercise_log.id}", headers=auth_headers)
    assert response.status_code == 200
    content = response.json()
    assert content["id"] == exercise_log.id

    response = client.get(f"{settings.API_V1_STR}/exercise_logs/{exercise_log.id}")
    assert response.status_code == 404
