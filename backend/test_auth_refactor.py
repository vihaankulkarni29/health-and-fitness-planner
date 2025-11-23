from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from app.core.config import settings
from app.auth import crud
from app.schemas.trainee import TraineeCreate
from app.models.user import User
from app.models.trainee import Trainee
from app.db.base import Base

# Setup DB connection
engine = create_engine(settings.SQLALCHEMY_DATABASE_URI)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
db = SessionLocal()

def test_create_and_fetch_user():
    print("Testing User Creation...")
    email = "test_refactor@example.com"
    password = "Password123!"
    
    # Cleanup if exists
    existing = db.query(User).filter(User.email == email).first()
    if existing:
        if existing.trainee_profile:
            db.delete(existing.trainee_profile)
        db.delete(existing)
        db.commit()
    
    # Create User via CRUD (which should create User + Trainee)
    user_in = TraineeCreate(
        first_name="Test",
        last_name="Refactor",
        email=email,
        password=password
    )
    
    user = crud.create_user(db, obj_in=user_in)
    print(f"User created: ID={user.id}, Email={user.email}, Role={user.role}")
    
    # Verify Trainee Profile
    assert user.trainee_profile is not None
    print(f"Trainee Profile: ID={user.trainee_profile.id}, Name={user.trainee_profile.first_name}")
    
    # Verify Email Property on Trainee
    print(f"Trainee Email Property: {user.trainee_profile.email}")
    assert user.trainee_profile.email == email
    
    print("✅ User Creation & Linking Verified!")

if __name__ == "__main__":
    try:
        test_create_and_fetch_user()
    except Exception as e:
        print(f"❌ Test Failed: {e}")
    finally:
        db.close()
