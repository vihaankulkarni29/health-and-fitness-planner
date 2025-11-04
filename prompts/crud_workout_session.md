# Prompt for Generating CRUD functions for WorkoutSession model

**Objective:** Create a Python script with CRUD (Create, Read, Update, Delete) functions for the `WorkoutSession` model.

**File Path:** `backend/app/crud/crud_workout_session.py`

**Model:** `app.models.workout_session.WorkoutSession`
**Schema:** `app.schemas.workout_session.WorkoutSessionCreate`, `app.schemas.workout_session.WorkoutSessionUpdate`

**Instructions:**

1.  Import necessary modules: `Session` from `sqlalchemy.orm`, `WorkoutSession` from `app.models.workout_session`, and `WorkoutSessionCreate`, `WorkoutSessionUpdate` from `app.schemas.workout_session`.
2.  Create a class `CRUDWorkoutSession`.
3.  Implement the following methods within the class:
    *   `get(self, db: Session, id: int)`: Retrieve a single workout session by its ID.
    *   `get_multi(self, db: Session, skip: int = 0, limit: int = 100)`: Retrieve multiple workout sessions with pagination.
    *   `create(self, db: Session, *, obj_in: WorkoutSessionCreate)`: Create a new workout session.
    *   `update(self, db: Session, *, db_obj: WorkoutSession, obj_in: WorkoutSessionUpdate)`: Update an existing workout session.
    *   `remove(self, db: Session, *, id: int)`: Delete a workout session by its ID.
4.  Create an instance of the class: `workout_session = CRUDWorkoutSession()`. 

**Example Code Structure:**

```python
from sqlalchemy.orm import Session
from app.models.workout_session import WorkoutSession
from app.schemas.workout_session import WorkoutSessionCreate, WorkoutSessionUpdate

class CRUDWorkoutSession:
    def get(self, db: Session, id: int):
        return db.query(WorkoutSession).filter(WorkoutSession.id == id).first()

    def get_multi(self, db: Session, skip: int = 0, limit: int = 100):
        return db.query(WorkoutSession).offset(skip).limit(limit).all()

    def create(self, db: Session, *, obj_in: WorkoutSessionCreate):
        db_obj = WorkoutSession(
            trainee_id=obj_in.trainee_id,
            program_id=obj_in.program_id,
            session_date=obj_in.session_date,
            status=obj_in.status,
        )
        db.add(db_obj)
        db.commit()
        db.refresh(db_obj)
        return db_obj

    def update(self, db: Session, *, db_obj: WorkoutSession, obj_in: WorkoutSessionUpdate):
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
        obj = db.query(WorkoutSession).get(id)
        if obj is None:
            return None
        db.delete(obj)
        db.commit()
        return obj

workout_session = CRUDWorkoutSession()
```
