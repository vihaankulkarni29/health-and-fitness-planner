from sqlalchemy.orm import Session

from app.models.program import Program
from app.schemas.program import ProgramCreate, ProgramUpdate


class CRUDProgram:
    def get(self, db: Session, id: int):
        return db.query(Program).filter(Program.id == id).first()

    def get_multi(self, db: Session, skip: int = 0, limit: int = 100):
        return db.query(Program).offset(skip).limit(limit).all()

    def create(self, db: Session, *, obj_in: ProgramCreate):
        # Construct via kwargs; ignore static type checker complaints about SQLAlchemy's dynamic __init__
        db_obj = Program(
            name=obj_in.name,              # type: ignore[call-arg]
            description=obj_in.description,# type: ignore[call-arg]
            trainer_id=obj_in.trainer_id,  # type: ignore[call-arg]
        )
        db.add(db_obj)
        db.commit()
        db.refresh(db_obj)
        return db_obj

    def update(self, db: Session, *, db_obj: Program, obj_in: ProgramUpdate):
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
        obj = db.query(Program).get(id)
        if obj is None:
            return None
        db.delete(obj)
        db.commit()
        return obj


program = CRUDProgram()
