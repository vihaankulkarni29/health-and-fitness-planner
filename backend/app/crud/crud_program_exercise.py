from sqlalchemy.orm import Session
from app.models.program_exercise import ProgramExercise
from app.schemas.program_exercise import ProgramExerciseCreate, ProgramExerciseUpdate

class CRUDProgramExercise:
    def get(self, db: Session, id: int):
        return db.query(ProgramExercise).filter(ProgramExercise.id == id).first()

    def get_multi(self, db: Session, skip: int = 0, limit: int = 100):
        return db.query(ProgramExercise).offset(skip).limit(limit).all()

    def create(self, db: Session, *, obj_in: ProgramExerciseCreate):
        db_obj = ProgramExercise(
            program_id=obj_in.program_id,
            exercise_id=obj_in.exercise_id,
            order=obj_in.order,
            prescribed_sets=obj_in.prescribed_sets,
            prescribed_reps=obj_in.prescribed_reps,
            prescribed_weight_kg=obj_in.prescribed_weight_kg,
        )
        db.add(db_obj)
        db.commit()
        db.refresh(db_obj)
        return db_obj

    def update(self, db: Session, *, db_obj: ProgramExercise, obj_in: ProgramExerciseUpdate):
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
        obj = db.query(ProgramExercise).get(id)
        if obj is None:
            return None
        db.delete(obj)
        db.commit()
        return obj

program_exercise = CRUDProgramExercise()
