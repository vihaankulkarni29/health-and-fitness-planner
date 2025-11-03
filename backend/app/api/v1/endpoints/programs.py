from typing import Any, List, Generator

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.crud.crud_program import program as crud_program
from app.schemas.program import Program, ProgramCreate, ProgramUpdate
from app.db.session import SessionLocal

router = APIRouter(prefix="/programs", tags=["programs"]) 


def get_db() -> Generator[Session, None, None]:
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@router.post("/", response_model=Program)
def create_program(
    *,
    db: Session = Depends(get_db),
    program_in: ProgramCreate,
) -> Any:
    p = crud_program.create(db, obj_in=program_in)
    return p


@router.get("/", response_model=List[Program])
def read_programs(
    db: Session = Depends(get_db),
    skip: int = 0,
    limit: int = 100,
) -> Any:
    programs = crud_program.get_multi(db, skip=skip, limit=limit)
    return programs


@router.get("/{program_id}", response_model=Program)
def read_program(
    program_id: int,
    db: Session = Depends(get_db),
) -> Any:
    p = crud_program.get(db, id=program_id)
    if not p:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Program not found")
    return p


@router.put("/{program_id}", response_model=Program)
def update_program(
    program_id: int,
    program_in: ProgramUpdate,
    db: Session = Depends(get_db),
) -> Any:
    p = crud_program.get(db, id=program_id)
    if not p:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Program not found")
    p = crud_program.update(db, db_obj=p, obj_in=program_in)
    return p


@router.delete("/{program_id}", response_model=Program)
def delete_program(
    program_id: int,
    db: Session = Depends(get_db),
) -> Any:
    p = crud_program.remove(db, id=program_id)
    if not p:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Program not found")
    return p
