"""
Dev utility: initialize database tables and seed a test user.

Prerequisites:
- Ensure app.core.config.settings.SQLALCHEMY_DATABASE_URI is set (e.g., via .env)
  Example for SQLite (for quick local testing):
    SQLALCHEMY_DATABASE_URI=sqlite:///./dev.db

Run:
  python -m app.scripts.dev_seed
"""
from app.db.session import SessionLocal, engine
from app.db.base import Base
from app.models.trainee import Trainee
from app.auth.token import get_password_hash

TEST_EMAIL = "test@example.com"
TEST_PASSWORD = "test1234"


def main() -> None:
    # Create tables if they do not exist (for dev only)
    Base.metadata.create_all(bind=engine)

    db = SessionLocal()
    try:
        user = db.query(Trainee).filter(Trainee.email == TEST_EMAIL).first()
        if user:
            print(f"User {TEST_EMAIL} already exists (id={user.id}).")
            return
        user = Trainee(
            first_name="Test",
            last_name="User",
            email=TEST_EMAIL,
            hashed_password=get_password_hash(TEST_PASSWORD),
        )
        db.add(user)
        db.commit()
        db.refresh(user)
        print(f"Seeded test user {TEST_EMAIL} with password '{TEST_PASSWORD}' (id={user.id}).")
    finally:
        db.close()


if __name__ == "__main__":
    main()
