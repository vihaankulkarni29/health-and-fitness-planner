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
