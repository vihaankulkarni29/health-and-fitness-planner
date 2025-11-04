from fastapi.testclient import TestClient
from sqlalchemy.orm import Session

from app.core.config import settings
from app.schemas.trainee import TraineeCreate
from app.schemas.program import ProgramCreate
from app.crud.crud_trainee import trainee as crud_trainee
from app.crud.crud_program import program as crud_program
from app.schemas.exercise import ExerciseCreate
from app.crud.crud_exercise import exercise as crud_exercise


def test_start_workout_session(client: TestClient, db_session: Session, auth_headers: dict[str, str]) -> None:
    # Create a trainee and a program for the test
    trainee = crud_trainee.create(db_session, obj_in=TraineeCreate(first_name="Test", last_name="Trainee", email="test.trainee@example.com", password="testpass123"))
    program = crud_program.create(db_session, obj_in=ProgramCreate(name="Test Program", description="A program for testing"))

    payload = {"trainee_id": trainee.id, "program_id": program.id}
    response = client.post(f"{settings.API_V1_STR}/workout-sessions/start", json=payload, headers=auth_headers)
    assert response.status_code == 200
    data = response.json()
    assert data["trainee_id"] == trainee.id
    assert data["program_id"] == program.id
    assert data["status"] == "in-progress"
    assert "session_date" in data


def test_log_exercise_in_session(client: TestClient, db_session: Session, auth_headers: dict[str, str]) -> None:
    # Start a workout session
    trainee = crud_trainee.create(db_session, obj_in=TraineeCreate(first_name="Test", last_name="Trainee 2", email="test.trainee2@example.com", password="testpass123"))
    program = crud_program.create(db_session, obj_in=ProgramCreate(name="Test Program 2", description="A program for testing"))
    session_response = client.post(f"{settings.API_V1_STR}/workout-sessions/start", json={"trainee_id": trainee.id, "program_id": program.id}, headers=auth_headers)
    session = session_response.json()
    
    # Create an exercise
    exercise = crud_exercise.create(db_session, obj_in=ExerciseCreate(name="Test Exercise", description="An exercise for testing"))

    # Log an exercise
    log_payload = {"exercise_id": exercise.id, "completed_sets": 3, "completed_reps": 10, "completed_weight_kg": 50}
    log_response = client.post(f"{settings.API_V1_STR}/workout-sessions/{session['id']}/log-exercise", json=log_payload, headers=auth_headers)
    assert log_response.status_code == 200
    log_data = log_response.json()
    assert log_data["session_id"] == session["id"]
    assert log_data["exercise_id"] == exercise.id
    assert log_data["volume_kg"] == 1500


def test_end_workout_session(client: TestClient, db_session: Session, auth_headers: dict[str, str]) -> None:
    # Start a workout session
    trainee = crud_trainee.create(db_session, obj_in=TraineeCreate(first_name="Test", last_name="Trainee 3", email="test.trainee3@example.com", password="testpass123"))
    program = crud_program.create(db_session, obj_in=ProgramCreate(name="Test Program 3", description="A program for testing"))
    session_response = client.post(f"{settings.API_V1_STR}/workout-sessions/start", json={"trainee_id": trainee.id, "program_id": program.id}, headers=auth_headers)
    session = session_response.json()

    # End the session
    end_response = client.put(f"{settings.API_V1_STR}/workout-sessions/{session['id']}/end", headers=auth_headers)
    assert end_response.status_code == 200
    end_data = end_response.json()
    assert end_data["status"] == "completed"


def test_read_workout_session(client: TestClient, db_session: Session, auth_headers: dict[str, str]) -> None:
    # Start a workout session and log an exercise
    trainee = crud_trainee.create(db_session, obj_in=TraineeCreate(first_name="Test", last_name="Trainee 4", email="test.trainee4@example.com", password="testpass123"))
    program = crud_program.create(db_session, obj_in=ProgramCreate(name="Test Program 4", description="A program for testing"))
    exercise = crud_exercise.create(db_session, obj_in=ExerciseCreate(name="Test Exercise 2", description="An exercise for testing"))

    session_response = client.post(f"{settings.API_V1_STR}/workout-sessions/start", json={"trainee_id": trainee.id, "program_id": program.id}, headers=auth_headers)
    session = session_response.json()
    client.post(f"{settings.API_V1_STR}/workout-sessions/{session['id']}/log-exercise", json={"exercise_id": exercise.id, "completed_sets": 3, "completed_reps": 10, "completed_weight_kg": 50}, headers=auth_headers)

    # Read the session
    read_response = client.get(f"{settings.API_V1_STR}/workout-sessions/{session['id']}")
    assert read_response.status_code == 200
    read_data = read_response.json()
    assert read_data["id"] == session["id"]
    assert len(read_data["exercise_logs"]) > 0
