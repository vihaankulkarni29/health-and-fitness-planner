from typing import Any, List

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.crud.crud_trainer import trainer as crud_trainer
from app.schemas.trainer import Trainer, TrainerCreate, TrainerUpdate
from app.api.deps import get_db
from app.auth.deps import get_current_user
from app.models.trainee import Trainee

router = APIRouter()  # Removed duplicate prefix


# Protected: requires authentication
@router.post("/", response_model=Trainer)
def create_trainer(
    *,
    db: Session = Depends(get_db),
    trainer_in: TrainerCreate,
    current_user: Trainee = Depends(get_current_user),
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


# Protected: requires authentication
@router.put("/{trainer_id}", response_model=Trainer)
def update_trainer(
    trainer_id: int,
    trainer_in: TrainerUpdate,
    db: Session = Depends(get_db),
    current_user: Trainee = Depends(get_current_user),
) -> Any:
    t = crud_trainer.get(db, id=trainer_id)
    if not t:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Trainer not found")
    t = crud_trainer.update(db, db_obj=t, obj_in=trainer_in)
    return t


# Protected: requires authentication
@router.delete("/{trainer_id}", response_model=Trainer)
def delete_trainer(
    trainer_id: int,
    db: Session = Depends(get_db),
    current_user: Trainee = Depends(get_current_user),
) -> Any:
    t = crud_trainer.remove(db, id=trainer_id)
    if not t:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Trainer not found")
    return t
