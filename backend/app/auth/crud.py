from sqlalchemy.orm import Session
from typing import Optional

from app.auth.token import get_password_hash
from app.models.trainee import Trainee
from app.schemas.trainee import TraineeCreate


def get_user_by_email(db: Session, *, email: str) -> Optional[Trainee]:
    return db.query(Trainee).filter(Trainee.email == email).first()


def create_user(db: Session, *, obj_in: TraineeCreate) -> Trainee:
    db_obj = Trainee(  # type: ignore[call-arg]
        first_name=obj_in.first_name,
        last_name=obj_in.last_name,
        email=obj_in.email,
        gym_id=obj_in.gym_id,
        trainer_id=obj_in.trainer_id,
        program_id=obj_in.program_id,
        hashed_password=get_password_hash(obj_in.password),
    )
    db.add(db_obj)
    db.commit()
    db.refresh(db_obj)
    return db_obj
