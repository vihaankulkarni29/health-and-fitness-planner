"""
Create a test user for demo purposes.
Run this script to create test@example.com with password test1234
"""
import sys
from pathlib import Path

# Add backend to path
sys.path.insert(0, str(Path(__file__).parent))

from app.db.session import SessionLocal
from app.db import base  # Import all models
from app.models.trainee import Trainee, UserRole
from app.auth.token import get_password_hash

def create_test_user():
    db = SessionLocal()
    
    try:
        # Check if user already exists
        existing = db.query(Trainee).filter(Trainee.email == "test@example.com").first()
        
        if existing:
            print(f"✅ User already exists:")
            print(f"   Email: {existing.email}")
            print(f"   ID: {existing.id}")
            print(f"   Name: {existing.first_name} {existing.last_name}")
            print(f"   Role: {existing.role}")
            
            # Update password to ensure it's correct
            existing.hashed_password = get_password_hash("test1234")
            db.commit()
            print(f"\n🔄 Password reset to: test1234")
        else:
            # Create new user
            print("🔧 Creating new test user...")
            
            new_user = Trainee(
                email="test@example.com",
                first_name="Test",
                last_name="User",
                hashed_password=get_password_hash("test1234"),
                role=UserRole.TRAINEE
            )
            
            db.add(new_user)
            db.commit()
            db.refresh(new_user)
            
            print(f"✅ Created new user:")
            print(f"   Email: {new_user.email}")
            print(f"   ID: {new_user.id}")
            print(f"   Name: {new_user.first_name} {new_user.last_name}")
            print(f"   Role: {new_user.role}")
        
        print("\n" + "="*50)
        print("📱 Demo Credentials:")
        print("="*50)
        print("Email:    test@example.com")
        print("Password: test1234")
        print("="*50)
        
    except Exception as e:
        print(f"❌ Error: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    create_test_user()
