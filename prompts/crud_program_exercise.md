# Prompt for Generating CRUD functions for ProgramExercise model

**Objective:** Create a Python script with CRUD (Create, Read, Update, Delete) functions for the `ProgramExercise` model.

**File Path:** `backend/app/crud/crud_program_exercise.py`

**Model:** `app.models.program_exercise.ProgramExercise`
**Schema:** `app.schemas.program_exercise.ProgramExerciseCreate`, `app.schemas.program_exercise.ProgramExerciseUpdate`

**Instructions:**

1.  Import necessary modules: `Session` from `sqlalchemy.orm`, `ProgramExercise` from `app.models.program_exercise`, and `ProgramExerciseCreate`, `ProgramExerciseUpdate` from `app.schemas.program_exercise`.
2.  Create a class `CRUDProgramExercise`.
3.  Implement the following methods within the class:
    *   `get(self, db: Session, id: int)`: Retrieve a single program exercise by its ID.
    *   `get_multi(self, db: Session, skip: int = 0, limit: int = 100)`: Retrieve multiple program exercises with pagination.
    *   `create(self, db: Session, *, obj_in: ProgramExerciseCreate)`: Create a new program exercise.
    *   `update(self, db: Session, *, db_obj: ProgramExercise, obj_in: ProgramExerciseUpdate)`: Update an existing program exercise.
    *   `remove(self, db: Session, *, id: int)`: Delete a program exercise by its ID.
4.  Create an instance of the class: `program_exercise = CRUDProgramExercise()`. 

**Example Code Structure:**

```python
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
```
