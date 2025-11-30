from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from app.core.config import settings
from app.models.user import User
from app.models.trainee import Trainee
from app.models.trainer import Trainer
from app.models.gym import Gym
from app.auth.token import verify_password, get_password_hash

# Setup database connection
engine = create_engine(settings.SQLALCHEMY_DATABASE_URI)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
db = SessionLocal()

email = "vihaan@example.com"
password = "TestPassword123!"

print(f"Checking user: {email}")
user = db.query(User).filter(User.email == email).first()

if not user:
    print("❌ User NOT found in database!")
else:
    print(f"✅ User found: ID={user.id}, Role={user.role}")
    print(f"Stored Hash: {user.hashed_password}")
    
    is_valid = verify_password(password, user.hashed_password)
    if is_valid:
        print("✅ Password verification SUCCESSFUL")
    else:
        print("❌ Password verification FAILED")
        
        # Debug: Generate what the hash SHOULD be
        new_hash = get_password_hash(password)
        print(f"Expected Hash (generated now): {new_hash}")
        print("Possible causes: SECRET_KEY mismatch, different hashing algorithm, or seed script didn't update.")

db.close()
