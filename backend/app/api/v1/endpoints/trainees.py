from typing import Any, List, Generator

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.crud.crud_trainee import trainee as crud_trainee
from app.schemas.trainee import Trainee, TraineeCreate, TraineeUpdate
from app.db.session import SessionLocal

router = APIRouter(prefix="/trainees", tags=["trainees"]) 


def get_db() -> Generator[Session, None, None]:
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@router.post("/", response_model=Trainee)
def create_trainee(
    *,
    db: Session = Depends(get_db),
    trainee_in: TraineeCreate,
) -> Any:
    existing = crud_trainee.get_by_email(db, email=trainee_in.email)
    if existing:
        raise HTTPException(status_code=400, detail="Trainee with this email already exists")
    t = crud_trainee.create(db, obj_in=trainee_in)
    return t


@router.get("/", response_model=List[Trainee])
def read_trainees(
    db: Session = Depends(get_db),
    skip: int = 0,
    limit: int = 100,
) -> Any:
    trainees = crud_trainee.get_multi(db, skip=skip, limit=limit)
    return trainees


@router.get("/{trainee_id}", response_model=Trainee)
def read_trainee(
    trainee_id: int,
    db: Session = Depends(get_db),
) -> Any:
    t = crud_trainee.get(db, id=trainee_id)
    if not t:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Trainee not found")
    return t


@router.put("/{trainee_id}", response_model=Trainee)
def update_trainee(
    trainee_id: int,
    trainee_in: TraineeUpdate,
    db: Session = Depends(get_db),
) -> Any:
    t = crud_trainee.get(db, id=trainee_id)
    if not t:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Trainee not found")
    t = crud_trainee.update(db, db_obj=t, obj_in=trainee_in)
    return t


@router.delete("/{trainee_id}", response_model=Trainee)
def delete_trainee(
    trainee_id: int,
    db: Session = Depends(get_db),
) -> Any:
    t = crud_trainee.remove(db, id=trainee_id)
    if not t:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Trainee not found")
    return t
