# Prompt for Generating CRUD functions for Trainee model

**Objective:** Create a Python script with CRUD (Create, Read, Update, Delete) functions for the `Trainee` model.

**File Path:** `backend/app/crud/crud_trainee.py`

**Model:** `app.models.trainee.Trainee`
**Schema:** `app.schemas.trainee.TraineeCreate`, `app.schemas.trainee.TraineeUpdate`

**Instructions:**

1.  Import necessary modules: `Session` from `sqlalchemy.orm`, `Trainee` from `app.models.trainee`, and `TraineeCreate`, `TraineeUpdate` from `app.schemas.trainee`.
2.  Create a class `CRUDTrainee`.
3.  Implement the following methods within the class:
    *   `get(self, db: Session, id: int)`: Retrieve a single trainee by its ID.
    *   `get_by_email(self, db: Session, email: str)`: Retrieve a single trainee by email.
    *   `get_multi(self, db: Session, skip: int = 0, limit: int = 100)`: Retrieve multiple trainees with pagination.
    *   `create(self, db: Session, *, obj_in: TraineeCreate)`: Create a new trainee.
    *   `update(self, db: Session, *, db_obj: Trainee, obj_in: TraineeUpdate)`: Update an existing trainee.
    *   `remove(self, db: Session, *, id: int)`: Delete a trainee by its ID.
4.  Create an instance of the class: `trainee = CRUDTrainee()`.

**Example Code Structure:**

```python
from sqlalchemy.orm import Session
from app.models.trainee import Trainee
from app.schemas.trainee import TraineeCreate, TraineeUpdate

class CRUDTrainee:
    def get(self, db: Session, id: int):
        return db.query(Trainee).filter(Trainee.id == id).first()

    def get_by_email(self, db: Session, email: str):
        return db.query(Trainee).filter(Trainee.email == email).first()

    def get_multi(self, db: Session, skip: int = 0, limit: int = 100):
        return db.query(Trainee).offset(skip).limit(limit).all()

    def create(self, db: Session, *, obj_in: TraineeCreate):
        db_obj = Trainee(
            first_name=obj_in.first_name,
            last_name=obj_in.last_name,
            email=obj_in.email,
            gym_id=obj_in.gym_id,
            trainer_id=obj_in.trainer_id,
            program_id=obj_in.program_id,
        )
        db.add(db_obj)
        db.commit()
        db.refresh(db_obj)
        return db_obj

    def update(self, db: Session, *, db_obj: Trainee, obj_in: TraineeUpdate):
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
        obj = db.query(Trainee).get(id)
        if obj is None:
            return None
        db.delete(obj)
        db.commit()
        return obj

trainee = CRUDTrainee()
```
