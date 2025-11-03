from typing import Any, List, Generator

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.crud.crud_trainer import trainer as crud_trainer
from app.schemas.trainer import Trainer, TrainerCreate, TrainerUpdate
from app.db.session import SessionLocal

router = APIRouter(prefix="/trainers", tags=["trainers"]) 


def get_db() -> Generator[Session, None, None]:
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@router.post("/", response_model=Trainer)
def create_trainer(
    *,
    db: Session = Depends(get_db),
    trainer_in: TrainerCreate,
) -> Any:
    existing = crud_trainer.get_by_email(db, email=trainer_in.email)
    if existing:
        raise HTTPException(status_code=400, detail="Trainer with this email already exists")
    t = crud_trainer.create(db, obj_in=trainer_in)
    return t


@router.get("/", response_model=List[Trainer])
def read_trainers(
    db: Session = Depends(get_db),
    skip: int = 0,
    limit: int = 100,
) -> Any:
    trainers = crud_trainer.get_multi(db, skip=skip, limit=limit)
    return trainers


@router.get("/{trainer_id}", response_model=Trainer)
def read_trainer(
    trainer_id: int,
    db: Session = Depends(get_db),
) -> Any:
    t = crud_trainer.get(db, id=trainer_id)
    if not t:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Trainer not found")
    return t


@router.put("/{trainer_id}", response_model=Trainer)
def update_trainer(
    trainer_id: int,
    trainer_in: TrainerUpdate,
    db: Session = Depends(get_db),
) -> Any:
    t = crud_trainer.get(db, id=trainer_id)
    if not t:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Trainer not found")
    t = crud_trainer.update(db, db_obj=t, obj_in=trainer_in)
    return t


@router.delete("/{trainer_id}", response_model=Trainer)
def delete_trainer(
    trainer_id: int,
    db: Session = Depends(get_db),
) -> Any:
    t = crud_trainer.remove(db, id=trainer_id)
    if not t:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Trainer not found")
    return t
