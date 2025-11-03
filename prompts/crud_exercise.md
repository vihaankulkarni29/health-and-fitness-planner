# Prompt for Generating CRUD functions for Exercise model

**Objective:** Create a Python script with CRUD (Create, Read, Update, Delete) functions for the `Exercise` model.

**File Path:** `backend/app/crud/crud_exercise.py`

**Model:** `app.models.exercise.Exercise`
**Schema:** `app.schemas.exercise.ExerciseCreate`, `app.schemas.exercise.ExerciseUpdate`

**Instructions:**

1.  Import necessary modules: `Session` from `sqlalchemy.orm`, `Exercise` from `app.models.exercise`, and `ExerciseCreate`, `ExerciseUpdate` from `app.schemas.exercise`.
2.  Create a class `CRUDExercise`.
3.  Implement the following methods within the class:
    *   `get(self, db: Session, id: int)`: Retrieve a single exercise by its ID.
    *   `get_by_name(self, db: Session, name: str)`: Retrieve a single exercise by name.
    *   `get_multi(self, db: Session, skip: int = 0, limit: int = 100)`: Retrieve multiple exercises with pagination.
    *   `create(self, db: Session, *, obj_in: ExerciseCreate)`: Create a new exercise.
    *   `update(self, db: Session, *, db_obj: Exercise, obj_in: ExerciseUpdate)`: Update an existing exercise.
    *   `remove(self, db: Session, *, id: int)`: Delete an exercise by its ID.
4.  Create an instance of the class: `exercise = CRUDExercise()`.

**Example Code Structure:**

```python
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

    def create(self, db: Session, *, obj_in: ExerciseCreate):
        db_obj = Exercise(
            name=obj_in.name,
            description=obj_in.description,
            video_url=obj_in.video_url,
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
        for field, value in update_data.items():
            if hasattr(db_obj, field):
                setattr(db_obj, field, update_data[field])
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
```
