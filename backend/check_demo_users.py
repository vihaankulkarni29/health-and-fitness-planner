
import os
import sys
from sqlalchemy import create_engine, text
from sqlalchemy.orm import sessionmaker
from app.core.config import settings

# Import all models to ensure they are registered
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

def check_users():
    print(f"Checking database: {settings.SQLALCHEMY_DATABASE_URI}")
    
    # Check for Vihaan
    vihaan = db.query(User).filter(User.email == "vihaan@example.com").first()
    if vihaan:
        print(f"User Vihaan found: {vihaan.email} ({vihaan.role})")
    else:
        print("User Vihaan NOT found.")

    # Check for Rohit
    rohit = db.query(User).filter(User.email == "rohit@example.com").first()
    if rohit:
        print(f"User Rohit found: {rohit.email} ({rohit.role})")
    else:
        print("User Rohit NOT found.")

    # List all users just in case
    users = db.query(User).all()
    print(f"\nTotal users in DB: {len(users)}")
    for u in users:
        print(f"- {u.email} ({u.role})")

if __name__ == "__main__":
    try:
        check_users()
    except Exception as e:
        print(f"Error checking users: {e}")
    finally:
        db.close()
