
import os
import sys
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from app.core.config import settings

# Import models
from app.models.user import User, UserRole
from app.models.trainee import Trainee
from app.models.trainer import Trainer
from app.models.program import Program
from app.models.gym import Gym
from app.models.health_metric import HealthMetric
from app.models.workout_session import WorkoutSession
from app.models.exercise import Exercise
from app.models.exercise_log import ExerciseLog
from app.models.program_exercise import ProgramExercise

# Setup database connection
engine = create_engine(settings.SQLALCHEMY_DATABASE_URI)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
db = SessionLocal()

def link_users():
    print(f"Linking users in database: {settings.SQLALCHEMY_DATABASE_URI}")

    # 1. Get Users
    vihaan_user = db.query(User).filter(User.email == "vihaan@example.com").first()
    rohit_user = db.query(User).filter(User.email == "rohit@example.com").first()

    if not vihaan_user or not rohit_user:
        print("Error: One or both users not found. Run seed_demo_users.py first.")
        return

    # 2. Get Profiles
    vihaan_profile = db.query(Trainee).filter(Trainee.user_id == vihaan_user.id).first()
    rohit_profile = db.query(Trainer).filter(Trainer.user_id == rohit_user.id).first()

    if not vihaan_profile or not rohit_profile:
        print("Error: Profiles not found.")
        return

    # 3. Link Trainer
    print(f"Assigning Trainer {rohit_profile.first_name} to Trainee {vihaan_profile.first_name}...")
    vihaan_profile.trainer_id = rohit_profile.id
    
    # 4. Create and Assign Program
    program_name = "Fat Loss & Strength"
    program = db.query(Program).filter(Program.name == program_name).first()
    
    if not program:
        print(f"Creating Program: {program_name}")
        program = Program(
            name=program_name,
            description="A 12-week program focused on metabolic conditioning and compound lifts.",
            trainer_id=rohit_profile.id
        )
        db.add(program)
        db.commit()
        db.refresh(program)
    
    print(f"Assigning Program '{program.name}' to Vihaan...")
    vihaan_profile.program_id = program.id
    
    db.commit()
    print("Linkage Complete! Vihaan is now ready for the demo.")

if __name__ == "__main__":
    try:
        link_users()
    except Exception as e:
        print(f"Error linking users: {e}")
        import traceback
        traceback.print_exc()
    finally:
        db.close()
