from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from app.core.config import settings

# Import all models FIRST to ensure SQLAlchemy relationships are properly initialized
from app.models.user import User, UserRole
from app.models.trainee import Trainee
from app.models.trainer import Trainer
from app.models.gym import Gym
from app.models.program import Program
from app.models.program_exercise import ProgramExercise
from app.models.exercise import Exercise
from app.models.workout_session import WorkoutSession
from app.models.exercise_log import ExerciseLog
from app.models.health_metric import HealthMetric
from app.db.base import Base

from app.auth import crud
from app.schemas.trainee import TraineeCreate
from app.schemas.workout_session import WorkoutSessionCreate
from app.api.v1.endpoints import workout_sessions
from fastapi import HTTPException

# Setup DB connection
engine = create_engine(settings.SQLALCHEMY_DATABASE_URI)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
db = SessionLocal()

def create_test_user(email, role=UserRole.TRAINEE):
    # Cleanup
    existing = db.query(User).filter(User.email == email).first()
    if existing:
        if existing.trainee_profile:
            db.delete(existing.trainee_profile)
        db.delete(existing)
        db.commit()
    
    user_in = TraineeCreate(
        first_name="Test",
        last_name="User",
        email=email,
        password="Password123!"
    )
    user = crud.create_user(db, obj_in=user_in)
    # Manually set role if needed (crud defaults to Trainee)
    if role != UserRole.TRAINEE:
        user.role = role
        db.commit()
    return user

def test_idor_protection():
    print("[SECURITY AUDIT] Starting IDOR Test...")
    
    # 1. Setup Victim and Attacker
    victim = create_test_user("victim@example.com")
    attacker = create_test_user("attacker@example.com")
    
    print(f"Created Victim (ID: {victim.id}) and Attacker (ID: {attacker.id})")
    
    # 2. Victim creates a private resource (Workout Session)
    session_in = WorkoutSessionCreate(
        trainee_id=victim.id, # Victim's ID
        program_id=1 # Dummy
    )
    
    from app.crud.crud_workout_session import workout_session as crud_ws
    from datetime import date
    victim_session = crud_ws.create(db, obj_in=session_in)
    print(f"Victim created Workout Session {victim_session.id}")
    
    # 3. Attacker tries to access Victim's session
    print("[TEST 1] Attacker attempts to read Victim's session...")
    try:
        # We call the endpoint function directly, passing the attacker as current_user
        workout_sessions.read_workout_session(
            session_id=victim_session.id,
            db=db,
            current_user=attacker # <--- The Attack
        )
        print("[FAIL] Attacker was able to read Victim's session!")
    except HTTPException as e:
        if e.status_code == 403:
            print("[PASS] Access Denied (403 Forbidden).")
        else:
            print(f"[FAIL] Unexpected error code {e.status_code}")
    except Exception as e:
        print(f"[FAIL] Unexpected exception: {e}")

    # 4. Attacker tries to log exercise in Victim's session
    print("[TEST 2] Attacker attempts to log exercise in Victim's session...")
    from app.schemas.exercise_log import ExerciseLogCreate
    log_in = ExerciseLogCreate(
        session_id=victim_session.id,
        exercise_id=1,
        completed_sets=1,
        completed_reps=1,
        completed_weight_kg=10
    )
    try:
        workout_sessions.log_exercise_in_session(
            session_id=victim_session.id,
            exercise_log_in=log_in,
            db=db,
            current_user=attacker # <--- The Attack
        )
        print("[FAIL] Attacker was able to log in Victim's session!")
    except HTTPException as e:
        if e.status_code == 403:
            print("[PASS] Access Denied (403 Forbidden).")
        else:
            print(f"[FAIL] Unexpected error code {e.status_code}")

    # Cleanup
    db.delete(victim_session)
    db.delete(victim.trainee_profile)
    db.delete(victim)
    db.delete(attacker.trainee_profile)
    db.delete(attacker)
    db.commit()

if __name__ == "__main__":
    try:
        test_idor_protection()
    except Exception as e:
        print(f"[ERROR] Test Script Error: {e}")
    finally:
        db.close()
