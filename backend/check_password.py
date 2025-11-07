import sqlite3
from app.auth.token import verify_password

conn = sqlite3.connect('dev.db')
cursor = conn.cursor()

# Check Vihaan's account
cursor.execute('SELECT email, hashed_password FROM trainees WHERE email = ?', 
               ('vihaan.kulkarni@fitnessdemo.com',))
row = cursor.fetchone()

if row:
    email, hashed_pw = row
    print(f"✅ User found: {email}")
    print(f"✅ Hash exists: {bool(hashed_pw)}")
    
    # Test password
    test_result = verify_password("trainee123", hashed_pw)
    print(f"🔐 Password 'trainee123' verification: {test_result}")
    
    if not test_result:
        print("❌ PASSWORD MISMATCH!")
        print(f"Hash in DB: {hashed_pw[:50]}...")
else:
    print("❌ User not found!")

conn.close()
