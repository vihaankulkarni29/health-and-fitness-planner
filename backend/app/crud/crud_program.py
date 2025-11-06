from sqlalchemy.orm import Session

from app.models.program import Program
from app.schemas.program import ProgramCreate, ProgramUpdate


class CRUDProgram:
    def get(self, db: Session, id: int):
        return db.query(Program).filter(Program.id == id).first()

    def get_multi(self, db: Session, skip: int = 0, limit: int = 100):
        return db.query(Program).offset(skip).limit(limit).all()

    def create(self, db: Session, *, obj_in: ProgramCreate | dict):
        """Create a Program from Pydantic model or dict.

        trainer_id is optional at the DB level; tests may omit it.
        """
        if isinstance(obj_in, dict):
            name = obj_in.get("name")
            description = obj_in.get("description")
            trainer_id = obj_in.get("trainer_id")
        else:
            name = obj_in.name                 # type: ignore[assignment]
            description = obj_in.description   # type: ignore[assignment]
            trainer_id = obj_in.trainer_id     # type: ignore[assignment]

        db_obj = Program(
            name=name,                    # type: ignore[call-arg]
            description=description,      # type: ignore[call-arg]
            trainer_id=trainer_id,        # type: ignore[call-arg]
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
