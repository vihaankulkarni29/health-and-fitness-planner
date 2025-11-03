from sqlalchemy.orm import Session

from app.models.trainer import Trainer
from app.schemas.trainer import TrainerCreate, TrainerUpdate


class CRUDTrainer:
    def get(self, db: Session, id: int):
        return db.query(Trainer).filter(Trainer.id == id).first()

    def get_by_email(self, db: Session, email: str):
        return db.query(Trainer).filter(Trainer.email == email).first()

    def get_multi(self, db: Session, skip: int = 0, limit: int = 100):
        return db.query(Trainer).offset(skip).limit(limit).all()

    def create(self, db: Session, *, obj_in: TrainerCreate):
        # Construct via kwargs; ignore static type checker complaints about SQLAlchemy's dynamic __init__
        db_obj = Trainer(
            first_name=obj_in.first_name,  # type: ignore[call-arg]
            last_name=obj_in.last_name,    # type: ignore[call-arg]
            email=obj_in.email,            # type: ignore[call-arg]
            gym_id=obj_in.gym_id,          # type: ignore[call-arg]
        )
        db.add(db_obj)
        db.commit()
        db.refresh(db_obj)
        return db_obj

    def update(self, db: Session, *, db_obj: Trainer, obj_in: TrainerUpdate):
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
        obj = db.query(Trainer).get(id)
        if obj is None:
            return None
        db.delete(obj)
        db.commit()
        return obj


trainer = CRUDTrainer()
