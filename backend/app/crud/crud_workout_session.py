"""CRUD operations for WorkoutSession.

- Accepts either minimal create payload (ids only) or a base payload that includes
    session_date and status. When omitted, sensible defaults are applied.
- Converts Enum values to strings for DB storage and relies on Pydantic to parse
    back to enums on response (via orm_mode).

NOTE:
- Consider using an async database driver for improved performance.
- Consider eager loading relationships (joinedload) for heavy read endpoints.
"""
from typing import Optional, Union
from datetime import date
from sqlalchemy.orm import Session

from app.models.workout_session import WorkoutSession
from app.schemas.enums import WorkoutSessionStatus
from app.schemas.workout_session import (
        WorkoutSessionCreate,
        WorkoutSessionUpdate,
        WorkoutSessionBase,
)


class CRUDWorkoutSession:
    def get(self, db: Session, id: int) -> Optional[WorkoutSession]:
        return db.query(WorkoutSession).filter(WorkoutSession.id == id).first()

    def get_multi(self, db: Session, skip: int = 0, limit: int = 100):
        # NOTE: Consider using joinedload for trainee/program if needed to reduce N+1 queries.
        return db.query(WorkoutSession).offset(skip).limit(limit).all()

    def create(
        self,
        db: Session,
        *,
        obj_in: Union[WorkoutSessionCreate, WorkoutSessionBase],
    ) -> WorkoutSession:
        # Derive optional fields with defaults
        _session_date = getattr(obj_in, "session_date", date.today())
        _status = getattr(obj_in, "status", WorkoutSessionStatus.IN_PROGRESS)
        if isinstance(_status, WorkoutSessionStatus):
            status_str = _status.value
        else:
            status_str = str(_status)

        db_obj = WorkoutSession()  # type: ignore[call-arg]
        # Set attributes via setattr to satisfy static type checkers for SQLAlchemy models
        from typing import Any as _Any
        _db_obj: _Any = db_obj
        setattr(_db_obj, "trainee_id", obj_in.trainee_id)
        setattr(_db_obj, "program_id", obj_in.program_id)
        setattr(_db_obj, "session_date", _session_date)
        setattr(_db_obj, "status", status_str)
        db.add(db_obj)
        db.commit()
        db.refresh(db_obj)
        return db_obj

    def update(self, db: Session, *, db_obj: WorkoutSession, obj_in: WorkoutSessionUpdate) -> WorkoutSession:
        update_data = obj_in if isinstance(obj_in, dict) else obj_in.dict(exclude_unset=True)
        from typing import Any as _Any
        _obj: _Any = db_obj
        for field, value in update_data.items():
            if field == "status" and isinstance(value, WorkoutSessionStatus):
                setattr(_obj, field, value.value)
                continue
            if hasattr(_obj, field):
                setattr(_obj, field, value)
        db.add(db_obj)
        db.commit()
        db.refresh(db_obj)
        return db_obj

    def remove(self, db: Session, *, id: int) -> Optional[WorkoutSession]:
        obj = db.query(WorkoutSession).get(id)
        if obj is None:
            return None
        db.delete(obj)
        db.commit()
        return obj


workout_session = CRUDWorkoutSession()