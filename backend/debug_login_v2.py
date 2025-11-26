
import sys
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from app.core.config import settings
from app.auth.token import verify_password, get_password_hash

# Import models
from app.models.user import User
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

def debug_login(email, password):
    print(f"Debugging login for: {email}")
    
    user = db.query(User).filter(User.email == email).first()
    if not user:
        print("User NOT found in database.")
        return

    print(f"User found: {user.email} (Role: {user.role})")
    print(f"Stored Hash: {user.hashed_password}")
    
    is_valid = verify_password(password, user.hashed_password)
    print(f"Password '{password}' valid? {is_valid}")
    
    if not is_valid:
        print("Password mismatch. Generating new hash for 'password123'...")
        new_hash = get_password_hash("password123")
        print(f"New Hash: {new_hash}")
        # Update it
        user.hashed_password = new_hash
        db.commit()
        print("Password updated to 'password123'")

if __name__ == "__main__":
    debug_login("vihaan@example.com", "password123")
    db.close()
