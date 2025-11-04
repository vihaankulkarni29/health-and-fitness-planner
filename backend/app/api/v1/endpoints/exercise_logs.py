from typing import Any, List, Generator

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.crud.crud_exercise_log import exercise_log as crud_exercise_log
from app.schemas.exercise_log import ExerciseLog, ExerciseLogCreate, ExerciseLogUpdate
from app.api.deps import get_db
from app.auth.deps import get_current_user
from app.models.trainee import Trainee

router = APIRouter()  # Removed duplicate prefix


# Protected: requires authentication
@router.post("/", response_model=ExerciseLog)
def create_exercise_log(
    *,
    db: Session = Depends(get_db),
    exercise_log_in: ExerciseLogCreate,
    current_user: Trainee = Depends(get_current_user),
) -> Any:
    exercise_log_obj = crud_exercise_log.create(db, obj_in=exercise_log_in)
    return exercise_log_obj


@router.get("/", response_model=List[ExerciseLog])
def read_exercise_logs(
    db: Session = Depends(get_db),
    skip: int = 0,
    limit: int = 100,
) -> Any:
    exercise_logs = crud_exercise_log.get_multi(db, skip=skip, limit=limit)
    return exercise_logs


@router.get("/{exercise_log_id}", response_model=ExerciseLog)
def read_exercise_log(
    exercise_log_id: int,
    db: Session = Depends(get_db),
) -> Any:
    exercise_log_obj = crud_exercise_log.get(db, id=exercise_log_id)
    if not exercise_log_obj:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="ExerciseLog not found")
    return exercise_log_obj


# Protected: requires authentication
@router.put("/{exercise_log_id}", response_model=ExerciseLog)
def update_exercise_log(
    exercise_log_id: int,
    exercise_log_in: ExerciseLogUpdate,
    db: Session = Depends(get_db),
    current_user: Trainee = Depends(get_current_user),
) -> Any:
    exercise_log_obj = crud_exercise_log.get(db, id=exercise_log_id)
    if not exercise_log_obj:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="ExerciseLog not found")
    exercise_log_obj = crud_exercise_log.update(db, db_obj=exercise_log_obj, obj_in=exercise_log_in)
    return exercise_log_obj


# Protected: requires authentication
@router.delete("/{exercise_log_id}", response_model=ExerciseLog)
def delete_exercise_log(
    exercise_log_id: int,
    db: Session = Depends(get_db),
    current_user: Trainee = Depends(get_current_user),
) -> Any:
    exercise_log_obj = crud_exercise_log.remove(db, id=exercise_log_id)
    if not exercise_log_obj:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="ExerciseLog not found")
    return exercise_log_obj
