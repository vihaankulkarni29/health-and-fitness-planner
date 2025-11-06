from typing import Any, List

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.crud.crud_program import program as crud_program
from app.schemas.program import Program, ProgramCreate, ProgramUpdate
from app.api.deps import get_db
from app.auth.deps import get_current_user, require_trainer
from app.models.trainee import Trainee

router = APIRouter()  # Removed duplicate prefix


# Protected: requires trainer role (trainers can create programs)
@router.post("/", response_model=Program)
def create_program(
    *,
    db: Session = Depends(get_db),
    program_in: ProgramCreate,
    current_user: Trainee = Depends(require_trainer),
) -> Any:
    """Create new program. Requires trainer or admin role."""
    p = crud_program.create(db, obj_in=program_in)
    return p


# Protected: authenticated users can view programs
@router.get("/", response_model=List[Program])
def read_programs(
    db: Session = Depends(get_db),
    skip: int = 0,
    limit: int = 100,
    current_user: Trainee = Depends(get_current_user),
) -> Any:
    """Retrieve programs. Requires authentication."""
    programs = crud_program.get_multi(db, skip=skip, limit=limit)
    return programs


# Protected: authenticated users can view program details
@router.get("/{program_id}", response_model=Program)
def read_program(
    program_id: int,
    db: Session = Depends(get_db),
    current_user: Trainee = Depends(get_current_user),
) -> Any:
    """Get program by ID. Requires authentication."""
    p = crud_program.get(db, id=program_id)
    if not p:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Program not found")
    return p


# Protected: requires trainer role
@router.put("/{program_id}", response_model=Program)
def update_program(
    program_id: int,
    program_in: ProgramUpdate,
    db: Session = Depends(get_db),
    current_user: Trainee = Depends(require_trainer),
) -> Any:
    """Update program. Requires trainer or admin role."""
    p = crud_program.get(db, id=program_id)
    if not p:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Program not found")
    p = crud_program.update(db, db_obj=p, obj_in=program_in)
    return p


# Protected: requires trainer role
@router.delete("/{program_id}", response_model=Program)
def delete_program(
    program_id: int,
    db: Session = Depends(get_db),
    current_user: Trainee = Depends(require_trainer),
) -> Any:
    """Delete program. Requires trainer or admin role."""
    # Load the program first to construct a stable response payload
    p = crud_program.get(db, id=program_id)
    if not p:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Program not found")
    # Build response payload as a plain dict to avoid lazy-load during serialization
    payload = {
        "id": p.id,
        "name": p.name,
        "description": p.description,
        "trainer_id": getattr(p, "trainer_id", None),
        "created_at": getattr(p, "created_at", None),
        "trainer": None,  # avoid detached relationship access
    }
    # Now delete the program from DB
    _ = crud_program.remove(db, id=program_id)
    return payload
