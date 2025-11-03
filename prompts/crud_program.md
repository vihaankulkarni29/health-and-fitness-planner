# Prompt for Generating CRUD functions for Program model

**Objective:** Create a Python script with CRUD (Create, Read, Update, Delete) functions for the `Program` model.

**File Path:** `backend/app/crud/crud_program.py`

**Model:** `app.models.program.Program`
**Schema:** `app.schemas.program.ProgramCreate`, `app.schemas.program.ProgramUpdate`

**Instructions:**

1.  Import necessary modules: `Session` from `sqlalchemy.orm`, `Program` from `app.models.program`, and `ProgramCreate`, `ProgramUpdate` from `app.schemas.program`.
2.  Create a class `CRUDProgram`.
3.  Implement the following methods within the class:
    *   `get(self, db: Session, id: int)`: Retrieve a single program by its ID.
    *   `get_multi(self, db: Session, skip: int = 0, limit: int = 100)`: Retrieve multiple programs with pagination.
    *   `create(self, db: Session, *, obj_in: ProgramCreate)`: Create a new program.
    *   `update(self, db: Session, *, db_obj: Program, obj_in: ProgramUpdate)`: Update an existing program.
    *   `remove(self, db: Session, *, id: int)`: Delete a program by its ID.
4.  Create an instance of the class: `program = CRUDProgram()`. 

**Example Code Structure:**

```python
from sqlalchemy.orm import Session
from app.models.program import Program
from app.schemas.program import ProgramCreate, ProgramUpdate

class CRUDProgram:
    def get(self, db: Session, id: int):
        return db.query(Program).filter(Program.id == id).first()

    def get_multi(self, db: Session, skip: int = 0, limit: int = 100):
        return db.query(Program).offset(skip).limit(limit).all()

    def create(self, db: Session, *, obj_in: ProgramCreate):
        db_obj = Program(
            name=obj_in.name,
            description=obj_in.description,
            trainer_id=obj_in.trainer_id,
        )
        db.add(db_obj)
        db.commit()
        db.refresh(db_obj)
        return db_obj

    def update(self, db: Session, *, db_obj: Program, obj_in: ProgramUpdate):
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
        obj = db.query(Program).get(id)
        if obj is None:
            return None
        db.delete(obj)
        db.commit()
        return obj

program = CRUDProgram()
```
