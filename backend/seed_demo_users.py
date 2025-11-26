
import os
import sys
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from app.core.config import settings
from app.auth.token import get_password_hash

# Import models
from app.models.user import User, UserRole
from app.models.trainee import Trainee
from app.models.trainer import Trainer
from app.models.gym import Gym
from app.models.program import Program
from app.models.health_metric import HealthMetric
from app.models.workout_session import WorkoutSession
from app.models.exercise import Exercise
from app.models.exercise_log import ExerciseLog
from app.models.program_exercise import ProgramExercise

# Setup database connection
engine = create_engine(settings.SQLALCHEMY_DATABASE_URI)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
db = SessionLocal()

def seed_users():
    print(f"Seeding database: {settings.SQLALCHEMY_DATABASE_URI}")

    # 1. Create Vihaan (Trainee)
    vihaan_email = "vihaan@example.com"
    vihaan = db.query(User).filter(User.email == vihaan_email).first()
    if not vihaan:
        print(f"Creating user: {vihaan_email}")
        vihaan = User(
            email=vihaan_email,
            hashed_password=get_password_hash("password123"),
            role=UserRole.TRAINEE,
            is_active=True
        )
        db.add(vihaan)
        db.commit()
        db.refresh(vihaan)
    else:
        print(f"User {vihaan_email} already exists.")

    # Check/Create Trainee Profile
    trainee_profile = db.query(Trainee).filter(Trainee.user_id == vihaan.id).first()
    if not trainee_profile:
        print(f"Creating Trainee profile for {vihaan_email}")
        trainee_profile = Trainee(
            user_id=vihaan.id,
            first_name="Vihaan",
            last_name="Kulkarni"
        )
        db.add(trainee_profile)
        db.commit()
    else:
        print(f"Trainee profile for {vihaan_email} already exists.")

    # 2. Create Rohit (Trainer)
    rohit_email = "rohit@example.com"
    rohit = db.query(User).filter(User.email == rohit_email).first()
    if not rohit:
        print(f"Creating user: {rohit_email}")
        rohit = User(
            email=rohit_email,
            hashed_password=get_password_hash("password123"),
            role=UserRole.TRAINER,
            is_active=True
        )
        db.add(rohit)
        db.commit()
        db.refresh(rohit)
    else:
        print(f"User {rohit_email} already exists.")

    # Check/Create Trainer Profile
    trainer_profile = db.query(Trainer).filter(Trainer.user_id == rohit.id).first()
    if not trainer_profile:
        print(f"Creating Trainer profile for {rohit_email}")
        trainer_profile = Trainer(
            user_id=rohit.id,
            first_name="Rohit",
            last_name="Wagh"
        )
        db.add(trainer_profile)
        db.commit()
    else:
        print(f"Trainer profile for {rohit_email} already exists.")

if __name__ == "__main__":
    try:
        seed_users()
    except Exception as e:
        print(f"Error seeding users: {e}")
        import traceback
        traceback.print_exc()
    finally:
        db.close()
