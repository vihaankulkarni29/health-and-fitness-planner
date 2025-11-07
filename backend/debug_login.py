"""
Debug login issue - test password verification
"""
import sys
from pathlib import Path
sys.path.insert(0, str(Path(__file__).parent))

from app.db.session import SessionLocal
from app.db import base
from app.auth import crud as auth_crud
from app.auth import token as auth_token

db = SessionLocal()

# Test credentials
email = "test@example.com"
password = "test1234"

print("="*60)
print("🔍 LOGIN DEBUG")
print("="*60)
print(f"Testing login for: {email}")
print(f"With password: {password}")
print()

# Get user from database
user = auth_crud.get_user_by_email(db, email=email)

if not user:
    print("❌ User not found in database!")
else:
    print(f"✅ User found:")
    print(f"   Email: {user.email}")
    print(f"   ID: {user.id}")
    print(f"   Name: {user.first_name} {user.last_name}")
    print(f"   Hashed Password: {user.hashed_password[:60]}...")
    print()
    
    # Test password verification
    print("🔐 Testing password verification...")
    is_valid = auth_token.verify_password(password, user.hashed_password)
    
    if is_valid:
        print("✅ Password is CORRECT!")
        print()
        print("="*60)
        print("✅ Login should work with these credentials:")
        print("="*60)
        print(f"Email:    {email}")
        print(f"Password: {password}")
        print("="*60)
    else:
        print("❌ Password verification FAILED!")
        print()
        print("Let me reset the password...")
        
        # Reset password
        user.hashed_password = auth_token.get_password_hash(password)
        db.commit()
        
        print("✅ Password has been reset!")
        print()
        
        # Test again
        is_valid_now = auth_token.verify_password(password, user.hashed_password)
        if is_valid_now:
            print("✅ Password verification now works!")
        else:
            print("❌ Still failing - there may be a bug in verification")

db.close()
