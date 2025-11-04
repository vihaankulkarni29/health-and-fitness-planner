# Prompt for Generating CRUD functions for HealthMetric model

**Objective:** Create a Python script with CRUD (Create, Read, Update, Delete) functions for the `HealthMetric` model.

**File Path:** `backend/app/crud/crud_health_metric.py`

**Model:** `app.models.health_metric.HealthMetric`
**Schema:** `app.schemas.health_metric.HealthMetricCreate`, `app.schemas.health_metric.HealthMetricUpdate`

**Instructions:**

1.  Import necessary modules: `Session` from `sqlalchemy.orm`, `HealthMetric` from `app.models.health_metric`, and `HealthMetricCreate`, `HealthMetricUpdate` from `app.schemas.health_metric`.
2.  Create a class `CRUDHealthMetric`.
3.  Implement the following methods within the class:
    *   `get(self, db: Session, id: int)`: Retrieve a single health metric by its ID.
    *   `get_multi(self, db: Session, skip: int = 0, limit: int = 100)`: Retrieve multiple health metrics with pagination.
    *   `create(self, db: Session, *, obj_in: HealthMetricCreate)`: Create a new health metric.
    *   `update(self, db: Session, *, db_obj: HealthMetric, obj_in: HealthMetricUpdate)`: Update an existing health metric.
    *   `remove(self, db: Session, *, id: int)`: Delete a health metric by its ID.
4.  Create an instance of the class: `health_metric = CRUDHealthMetric()`. 

**Example Code Structure:**

```python
from sqlalchemy.orm import Session
from app.models.health_metric import HealthMetric
from app.schemas.health_metric import HealthMetricCreate, HealthMetricUpdate

class CRUDHealthMetric:
    def get(self, db: Session, id: int):
        return db.query(HealthMetric).filter(HealthMetric.id == id).first()

    def get_multi(self, db: Session, skip: int = 0, limit: int = 100):
        return db.query(HealthMetric).offset(skip).limit(limit).all()

    def create(self, db: Session, *, obj_in: HealthMetricCreate):
        db_obj = HealthMetric(
            trainee_id=obj_in.trainee_id,
            height_cm=obj_in.height_cm,
            weight_kg=obj_in.weight_kg,
            body_fat_percentage=obj_in.body_fat_percentage,
        )
        db.add(db_obj)
        db.commit()
        db.refresh(db_obj)
        return db_obj

    def update(self, db: Session, *, db_obj: HealthMetric, obj_in: HealthMetricUpdate):
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
        obj = db.query(HealthMetric).get(id)
        if obj is None:
            return None
        db.delete(obj)
        db.commit()
        return obj

health_metric = CRUDHealthMetric()
```
