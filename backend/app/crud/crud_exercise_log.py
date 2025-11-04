from sqlalchemy.orm import Session
from app.models.exercise_log import ExerciseLog
from app.schemas.exercise_log import ExerciseLogCreate, ExerciseLogUpdate

class CRUDExerciseLog:
    def get(self, db: Session, id: int):
        return db.query(ExerciseLog).filter(ExerciseLog.id == id).first()

    def get_multi(self, db: Session, skip: int = 0, limit: int = 100):
        return db.query(ExerciseLog).offset(skip).limit(limit).all()

    def create(self, db: Session, *, obj_in: ExerciseLogCreate):
        db_obj = ExerciseLog(
            session_id=obj_in.session_id,
            exercise_id=obj_in.exercise_id,
            completed_sets=obj_in.completed_sets,
            completed_reps=obj_in.completed_reps,
            completed_weight_kg=obj_in.completed_weight_kg,
            volume_kg=obj_in.volume_kg,
            is_completed=obj_in.is_completed,
        )
        db.add(db_obj)
        db.commit()
        db.refresh(db_obj)
        return db_obj

    def update(self, db: Session, *, db_obj: ExerciseLog, obj_in: ExerciseLogUpdate):
        if isinstance(obj_in, dict):
            update_data = obj_in
        else:
            update_data = obj_in.dict(exclude_unset=True)
        for field, value in update_data.items():
            if hasattr(db_obj, field):
                setattr(db_obj, field, update_data[field])
        db.add(db_obj)
        db.commit()
        db.refresh(db_obj)
        return db_obj

    def remove(self, db: Session, *, id: int):
        obj = db.query(ExerciseLog).get(id)
        if obj is None:
            return None
        db.delete(obj)
        db.commit()
        return obj

exercise_log = CRUDExerciseLog()
