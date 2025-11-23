from sqlalchemy.orm import Session
from typing import Optional

from app.auth.token import get_password_hash
from app.models.user import User, UserRole
from app.schemas.trainee import TraineeCreate # We might need a UserCreate schema later

def get_user_by_email(db: Session, *, email: str) -> Optional[User]:
    return db.query(User).filter(User.email == email).first()

def create_user(db: Session, *, obj_in: TraineeCreate) -> User:
    # This is a temporary adapter to keep the sign-up working for Trainees
    # In the future, we should have separate create_user logic or a unified one
    
    # 1. Create User
    db_user = User(
        email=obj_in.email,
        hashed_password=get_password_hash(obj_in.password),
        role=UserRole.TRAINEE
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    
    # 2. Create Trainee Profile linked to User
    from app.models.trainee import Trainee
    db_trainee = Trainee(
        user_id=db_user.id,
        first_name=obj_in.first_name,
        last_name=obj_in.last_name,
        gym_id=obj_in.gym_id,
        trainer_id=obj_in.trainer_id,
        program_id=obj_in.program_id
    )
    db.add(db_trainee)
    db.commit()
    db.refresh(db_trainee)
    
    return db_user
