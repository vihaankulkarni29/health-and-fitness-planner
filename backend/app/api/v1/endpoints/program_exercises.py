from typing import Any, List

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.crud.crud_program_exercise import program_exercise as crud_program_exercise
from app.schemas.program_exercise import ProgramExercise, ProgramExerciseCreate, ProgramExerciseUpdate
from app.api.deps import get_db
from app.auth.deps import get_current_user
from app.models.trainee import Trainee

router = APIRouter()  # Removed duplicate prefix


# Protected: requires authentication
@router.post("/", response_model=ProgramExercise)
def create_program_exercise(
    *,
    db: Session = Depends(get_db),
    program_exercise_in: ProgramExerciseCreate,
    current_user: Trainee = Depends(get_current_user),
) -> Any:
    program_exercise_obj = crud_program_exercise.create(db, obj_in=program_exercise_in)
    return program_exercise_obj


@router.get("/", response_model=List[ProgramExercise])
def read_program_exercises(
    db: Session = Depends(get_db),
    skip: int = 0,
    limit: int = 100,
) -> Any:
    program_exercises = crud_program_exercise.get_multi(db, skip=skip, limit=limit)
    return program_exercises


@router.get("/{program_exercise_id}", response_model=ProgramExercise)
def read_program_exercise(
    program_exercise_id: int,
    db: Session = Depends(get_db),
) -> Any:
    program_exercise_obj = crud_program_exercise.get(db, id=program_exercise_id)
    if not program_exercise_obj:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="ProgramExercise not found")
    return program_exercise_obj


# Protected: requires authentication
@router.put("/{program_exercise_id}", response_model=ProgramExercise)
def update_program_exercise(
    program_exercise_id: int,
    program_exercise_in: ProgramExerciseUpdate,
    db: Session = Depends(get_db),
    current_user: Trainee = Depends(get_current_user),
) -> Any:
    program_exercise_obj = crud_program_exercise.get(db, id=program_exercise_id)
    if not program_exercise_obj:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="ProgramExercise not found")
    program_exercise_obj = crud_program_exercise.update(db, db_obj=program_exercise_obj, obj_in=program_exercise_in)
    return program_exercise_obj


# Protected: requires authentication
@router.delete("/{program_exercise_id}", response_model=ProgramExercise)
def delete_program_exercise(
    program_exercise_id: int,
    db: Session = Depends(get_db),
    current_user: Trainee = Depends(get_current_user),
) -> Any:
    program_exercise_obj = crud_program_exercise.remove(db, id=program_exercise_id)
    if not program_exercise_obj:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="ProgramExercise not found")
    return program_exercise_obj
