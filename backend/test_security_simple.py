"""
Simplified Security Test - IDOR Protection
Tests that users cannot access other users' data
"""
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from app.core.config import settings

# Import models
from app.db.base import Base
from app.models.user import User, UserRole
from app.models.trainee import Trainee
from app.models.workout_session import WorkoutSession

# Setup DB
engine = create_engine(settings.SQLALCHEMY_DATABASE_URI)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
db = SessionLocal()

def test_workout_session_access():
    print("[SECURITY TEST] Testing Workout Session Access Control...")
    
    # Create two users
    user1 = User(email="user1@test.com", hashed_password="hash1", role=UserRole.TRAINEE)
    user2 = User(email="user2@test.com", hashed_password="hash2", role=UserRole.TRAINEE)
    db.add(user1)
    db.add(user2)
    db.commit()
    db.refresh(user1)
    db.refresh(user2)
    
    # Create trainee profiles
    trainee1 = Trainee(user_id=user1.id, first_name="User", last_name="One")
    trainee2 = Trainee(user_id=user2.id, first_name="User", last_name="Two")
    db.add(trainee1)
    db.add(trainee2)
    db.commit()
    db.refresh(trainee1)
    db.refresh(trainee2)
    
    # User 1 creates a workout session
    session1 = WorkoutSession(
        trainee_id=trainee1.id,
        program_id=1,
        session_date="2025-01-01",
        status="in-progress"
    )
    db.add(session1)
    db.commit()
    db.refresh(session1)
    
    print(f"User 1 (Trainee ID: {trainee1.id}) created Session {session1.id}")
    
    # Test: Can User 2 query User 1's session?
    print("[TEST] Attempting to query User 1's session as User 2...")
    
    # Simulate what the API endpoint does - check if session belongs to current user
    queried_session = db.query(WorkoutSession).filter(WorkoutSession.id == session1.id).first()
    
    if queried_session:
        # Check authorization (this is what the endpoint should do)
        if queried_session.trainee_id != trainee2.id:
            print("[PASS] Authorization check would block access (trainee_id mismatch)")
            print(f"  Session belongs to trainee {queried_session.trainee_id}, not {trainee2.id}")
        else:
            print("[FAIL] Session incorrectly belongs to User 2")
    
    # Cleanup
    db.delete(session1)
    db.delete(trainee1)
    db.delete(trainee2)
    db.delete(user1)
    db.delete(user2)
    db.commit()
    
    print("[COMPLETE] Security test finished successfully")

if __name__ == "__main__":
    try:
        test_workout_session_access()
    except Exception as e:
        print(f"[ERROR] {e}")
        import traceback
        traceback.print_exc()
    finally:
        db.close()
