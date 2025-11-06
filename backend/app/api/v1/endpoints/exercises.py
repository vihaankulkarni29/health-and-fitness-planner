from typing import Any, List

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.crud.crud_exercise import exercise as crud_exercise
from app.schemas.exercise import Exercise, ExerciseCreate, ExerciseUpdate
from app.api.deps import get_db
from app.auth.deps import get_current_user, require_trainer
from app.models.trainee import Trainee

router = APIRouter()  # Removed duplicate prefix 


# Protected: requires trainer or admin role
@router.post("/", response_model=Exercise)
def create_exercise(
    *,
    db: Session = Depends(get_db),
    exercise_in: ExerciseCreate,
    current_user: Trainee = Depends(require_trainer),
) -> Any:
    """
    Create new exercise. Requires trainer or admin role.
    Trainers manage the exercise library.
    """
    existing = crud_exercise.get_by_name(db, name=exercise_in.name)
    if existing:
        raise HTTPException(status_code=400, detail="Exercise with this name already exists")
    e = crud_exercise.create(db, obj_in=exercise_in)
    return e


@router.get("/", response_model=List[Exercise])
def read_exercises(
    db: Session = Depends(get_db),
    skip: int = 0,
    limit: int = 100,
    current_user: Trainee = Depends(get_current_user),
) -> Any:
    """
    Get list of exercises. Requires authentication.
    All authenticated users can view the exercise library.
    """
    exercises = crud_exercise.get_multi(db, skip=skip, limit=limit)
    return exercises


@router.get("/{exercise_id}", response_model=Exercise)
def read_exercise(
    exercise_id: int,
    db: Session = Depends(get_db),
    current_user: Trainee = Depends(get_current_user),
) -> Any:
    """
    Get exercise by ID. Requires authentication.
    """
    e = crud_exercise.get(db, id=exercise_id)
    if not e:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Exercise not found")
    return e


# Protected: requires trainer or admin role
@router.put("/{exercise_id}", response_model=Exercise)
def update_exercise(
    exercise_id: int,
    exercise_in: ExerciseUpdate,
    db: Session = Depends(get_db),
    current_user: Trainee = Depends(require_trainer),
) -> Any:
    """
    Update exercise. Requires trainer or admin role.
    Only trainers can modify the exercise library.
    """
    e = crud_exercise.get(db, id=exercise_id)
    if not e:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Exercise not found")
    e = crud_exercise.update(db, db_obj=e, obj_in=exercise_in)
    return e


# Protected: requires trainer or admin role
@router.delete("/{exercise_id}", response_model=Exercise)
def delete_exercise(
    exercise_id: int,
    db: Session = Depends(get_db),
    current_user: Trainee = Depends(require_trainer),
) -> Any:
    """
    Delete exercise. Requires trainer or admin role.
    Only trainers can remove exercises from the library.
    """
    e = crud_exercise.remove(db, id=exercise_id)
    if not e:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Exercise not found")
    return e

