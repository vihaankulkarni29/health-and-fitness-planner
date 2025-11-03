from sqlalchemy.orm import Session

from app.models.gym import Gym
from app.schemas.gym import GymCreate, GymUpdate


class CRUDGym:
    def get(self, db: Session, id: int):
        return db.query(Gym).filter(Gym.id == id).first()

    def get_multi(self, db: Session, skip: int = 0, limit: int = 100):
        return db.query(Gym).offset(skip).limit(limit).all()

    def get_by_name(self, db: Session, *, name: str):
        return db.query(Gym).filter(Gym.name == name).first()

    def create(self, db: Session, *, obj_in: GymCreate):
        # Construct via kwargs; ignore static type checker complaints about SQLAlchemy's dynamic __init__
        db_obj = Gym(
            name=obj_in.name,  # type: ignore[call-arg]
            address=obj_in.address,  # type: ignore[call-arg]
        )
        db.add(db_obj)
        db.commit()
        db.refresh(db_obj)
        return db_obj

    def update(self, db: Session, *, db_obj: Gym, obj_in: GymUpdate):
        if isinstance(obj_in, dict):
            update_data = obj_in
        else:
            update_data = obj_in.dict(exclude_unset=True)
        # Cast to Any to avoid static type checker issues with SQLAlchemy model attribute assignment
        from typing import Any as _Any  # local import to keep dependencies minimal
        _obj: _Any = db_obj
        for field, value in update_data.items():
            if hasattr(_obj, field):
                setattr(_obj, field, value)
        db.add(db_obj)
        db.commit()
        db.refresh(db_obj)
        return db_obj

    def remove(self, db: Session, *, id: int):
        obj = db.query(Gym).get(id)
        if obj is None:
            return None
        db.delete(obj)
        db.commit()
        return obj


gym = CRUDGym()
