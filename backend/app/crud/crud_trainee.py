from sqlalchemy.orm import Session

from app.models.trainee import Trainee
from app.schemas.trainee import TraineeCreate, TraineeUpdate


class CRUDTrainee:
    def get(self, db: Session, id: int):
        return db.query(Trainee).filter(Trainee.id == id).first()

    def get_by_email(self, db: Session, email: str):
        return db.query(Trainee).filter(Trainee.email == email).first()

    def get_multi(self, db: Session, skip: int = 0, limit: int = 100):
        return db.query(Trainee).offset(skip).limit(limit).all()

    def create(self, db: Session, *, obj_in: TraineeCreate | dict):
        """Create a Trainee from either a Pydantic model or a plain dict."""
        from app.models.user import User, UserRole
        from app.auth.token import get_password_hash

        if isinstance(obj_in, dict):
            first_name = obj_in.get("first_name")
            last_name = obj_in.get("last_name")
            email = obj_in.get("email")
            gym_id = obj_in.get("gym_id")
            trainer_id = obj_in.get("trainer_id")
            program_id = obj_in.get("program_id")
            password = obj_in.get("password") or "testpass123"
        else:
            first_name = obj_in.first_name
            last_name = obj_in.last_name
            email = obj_in.email
            gym_id = obj_in.gym_id
            trainer_id = obj_in.trainer_id
            program_id = obj_in.program_id
            password = obj_in.password

        # 1. Create User
        db_user = User(
            email=email,
            hashed_password=get_password_hash(password),
            role=UserRole.TRAINEE
        )
        db.add(db_user)
        db.commit()
        db.refresh(db_user)

        # 2. Create Trainee Profile
        db_obj = Trainee(
            user_id=db_user.id,
            first_name=first_name,
            last_name=last_name,
            gym_id=gym_id,
            trainer_id=trainer_id,
            program_id=program_id,
        )
        db.add(db_obj)
        db.commit()
        db.refresh(db_obj)
        return db_obj

    def update(self, db: Session, *, db_obj: Trainee, obj_in: TraineeUpdate):
        if isinstance(obj_in, dict):
            update_data = obj_in
        else:
            update_data = obj_in.dict(exclude_unset=True)
        from typing import Any as _Any
        _obj: _Any = db_obj
        for field, value in update_data.items():
            if hasattr(_obj, field):
                setattr(_obj, field, value)
        db.add(db_obj)
        db.commit()
        db.refresh(db_obj)
        return db_obj

    def remove(self, db: Session, *, id: int):
        obj = db.query(Trainee).get(id)
        if obj is None:
            return None
        db.delete(obj)
        db.commit()
        return obj


trainee = CRUDTrainee()
