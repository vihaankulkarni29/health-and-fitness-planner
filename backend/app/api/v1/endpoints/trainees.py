from typing import Any, List

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.crud.crud_trainee import trainee as crud_trainee
from app.crud.crud_program import program as crud_program
from app.schemas.trainee import Trainee, TraineeCreate, TraineeUpdate
from app.api.deps import get_db
from app.auth.deps import get_current_user
from app.models.trainee import Trainee as TraineeModel

router = APIRouter()  # Removed duplicate prefix


# Protected: requires authentication
@router.post("/", response_model=Trainee)
def create_trainee(
    *,
    db: Session = Depends(get_db),
    trainee_in: TraineeCreate,
    current_user: TraineeModel = Depends(get_current_user),
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


# Protected: requires authentication
@router.put("/{trainee_id}", response_model=Trainee)
def update_trainee(
    trainee_id: int,
    trainee_in: TraineeUpdate,
    db: Session = Depends(get_db),
    current_user: TraineeModel = Depends(get_current_user),
) -> Any:
    t = crud_trainee.get(db, id=trainee_id)
    if not t:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Trainee not found")
    t = crud_trainee.update(db, db_obj=t, obj_in=trainee_in)
    return t


# Protected: requires authentication
@router.put("/{trainee_id}/assign-program/{program_id}", response_model=Trainee)
def assign_program_to_trainee(
    trainee_id: int,
    program_id: int,
    db: Session = Depends(get_db),
    current_user: TraineeModel = Depends(get_current_user),
) -> Any:
    trainee = crud_trainee.get(db, id=trainee_id)
    if not trainee:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Trainee not found")

    program = crud_program.get(db, id=program_id)
    if not program:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Program not found")

    trainee_in = TraineeUpdate(program_id=program_id)
    trainee = crud_trainee.update(db, db_obj=trainee, obj_in=trainee_in)
    return trainee


# Protected: requires authentication
@router.delete("/{trainee_id}", response_model=Trainee)
def delete_trainee(
    trainee_id: int,
    db: Session = Depends(get_db),
    current_user: TraineeModel = Depends(get_current_user),
) -> Any:
    t = crud_trainee.remove(db, id=trainee_id)
    if not t:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Trainee not found")
    return t
