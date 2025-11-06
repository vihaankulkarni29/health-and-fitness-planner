from sqlalchemy.orm import Session

from app.models.exercise import Exercise
from app.schemas.exercise import ExerciseCreate, ExerciseUpdate


class CRUDExercise:
    def get(self, db: Session, id: int):
        return db.query(Exercise).filter(Exercise.id == id).first()

    def get_by_name(self, db: Session, name: str):
        return db.query(Exercise).filter(Exercise.name == name).first()

    def get_multi(self, db: Session, skip: int = 0, limit: int = 100):
        return db.query(Exercise).offset(skip).limit(limit).all()

    def create(self, db: Session, *, obj_in: ExerciseCreate | dict):
        """Create an Exercise from Pydantic model or dict."""
        if isinstance(obj_in, dict):
            name = obj_in.get("name")
            description = obj_in.get("description")
            video_url = obj_in.get("video_url")
        else:
            name = obj_in.name               # type: ignore[assignment]
            description = obj_in.description # type: ignore[assignment]
            video_url = obj_in.video_url     # type: ignore[assignment]

        db_obj = Exercise(
            name=name,                    # type: ignore[call-arg]
            description=description,      # type: ignore[call-arg]
            video_url=video_url,          # type: ignore[call-arg]
        )
        db.add(db_obj)
        db.commit()
        db.refresh(db_obj)
        return db_obj

    def update(self, db: Session, *, db_obj: Exercise, obj_in: ExerciseUpdate):
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
        obj = db.query(Exercise).get(id)
        if obj is None:
            return None
        db.delete(obj)
        db.commit()
        return obj


exercise = CRUDExercise()
