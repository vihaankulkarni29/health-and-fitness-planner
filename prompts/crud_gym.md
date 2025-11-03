# Prompt for Generating CRUD functions for Gym model

**Objective:** Create a Python script with CRUD (Create, Read, Update, Delete) functions for the `Gym` model.

**File Path:** `backend/app/crud/crud_gym.py`

**Model:** `app.models.gym.Gym`
**Schema:** `app.schemas.gym.GymCreate`, `app.schemas.gym.GymUpdate`

**Instructions:**

1.  Import necessary modules: `Session` from `sqlalchemy.orm`, `Gym` from `app.models.gym`, and `GymCreate`, `GymUpdate` from `app.schemas.gym`.
2.  Create a class `CRUDGym`.
3.  Implement the following methods within the class:
    *   `get(self, db: Session, id: int)`: Retrieve a single gym by its ID.
    *   `get_multi(self, db: Session, skip: int = 0, limit: int = 100)`: Retrieve multiple gyms with pagination.
    *   `create(self, db: Session, *, obj_in: GymCreate)`: Create a new gym.
    *   `update(self, db: Session, *, db_obj: Gym, obj_in: GymUpdate)`: Update an existing gym.
    *   `remove(self, db: Session, *, id: int)`: Delete a gym by its ID.
4.  Create an instance of the class: `gym = CRUDGym()`.

**Example Code Structure:**

```python
from sqlalchemy.orm import Session
from app.models.gym import Gym
from app.schemas.gym import GymCreate, GymUpdate

class CRUDGym:
    def get(self, db: Session, id: int):
        return db.query(Gym).filter(Gym.id == id).first()

    def get_multi(self, db: Session, skip: int = 0, limit: int = 100):
        return db.query(Gym).offset(skip).limit(limit).all()

    def create(self, db: Session, *, obj_in: GymCreate):
        db_obj = Gym(
            name=obj_in.name,
            address=obj_in.address,
        )
        db.add(db_obj)
        db.commit()
        db.refresh(db_obj)
        return db_obj

    def update(self, db: Session, *, db_obj: Gym, obj_in: GymUpdate):
        if isinstance(obj_in, dict):
            update_data = obj_in
        else:
            update_data = obj_in.dict(exclude_unset=True)
        for field in update_data:
            if hasattr(db_obj, field):
                setattr(db_obj, field, update_data[field])
        db.add(db_obj)
        db.commit()
        db.refresh(db_obj)
        return db_obj

    def remove(self, db: Session, *, id: int):
        obj = db.query(Gym).get(id)
        db.delete(obj)
        db.commit()
        return obj

gym = CRUDGym()
```
