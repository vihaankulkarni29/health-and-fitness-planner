# Prompt for Generating CRUD functions for Trainer model

**Objective:** Create a Python script with CRUD (Create, Read, Update, Delete) functions for the `Trainer` model.

**File Path:** `backend/app/crud/crud_trainer.py`

**Model:** `app.models.trainer.Trainer`
**Schema:** `app.schemas.trainer.TrainerCreate`, `app.schemas.trainer.TrainerUpdate`

**Instructions:**

1.  Import necessary modules: `Session` from `sqlalchemy.orm`, `Trainer` from `app.models.trainer`, and `TrainerCreate`, `TrainerUpdate` from `app.schemas.trainer`.
2.  Create a class `CRUDTrainer`.
3.  Implement the following methods within the class:
    *   `get(self, db: Session, id: int)`: Retrieve a single trainer by its ID.
    *   `get_by_email(self, db: Session, email: str)`: Retrieve a single trainer by email.
    *   `get_multi(self, db: Session, skip: int = 0, limit: int = 100)`: Retrieve multiple trainers with pagination.
    *   `create(self, db: Session, *, obj_in: TrainerCreate)`: Create a new trainer.
    *   `update(self, db: Session, *, db_obj: Trainer, obj_in: TrainerUpdate)`: Update an existing trainer.
    *   `remove(self, db: Session, *, id: int)`: Delete a trainer by its ID.
4.  Create an instance of the class: `trainer = CRUDTrainer()`.

**Example Code Structure:**

```python
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
        db_obj = Trainer(
            first_name=obj_in.first_name,
            last_name=obj_in.last_name,
            email=obj_in.email,
            gym_id=obj_in.gym_id,
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
        for field, value in update_data.items():
            if hasattr(db_obj, field):
                setattr(db_obj, field, update_data[field])
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
```
