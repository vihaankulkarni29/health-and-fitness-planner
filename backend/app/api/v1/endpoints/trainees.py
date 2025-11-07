from typing import Any, List

from fastapi import APIRouter, Depends, HTTPException, status, Request
from sqlalchemy.orm import Session

from app.crud.crud_trainee import trainee as crud_trainee
from app.crud.crud_program import program as crud_program
from app.schemas.trainee import Trainee, TraineeCreate, TraineeUpdate
from app.api.deps import get_db
from app.auth.deps import get_current_user, require_trainer, require_admin
from app.models.trainee import Trainee as TraineeModel, UserRole
from app.core.rate_limit import limiter, RATE_LIMIT_STRICT

router = APIRouter()  # Removed duplicate prefix


# Public endpoint for user registration
@router.post("/", response_model=Trainee)
@limiter.limit(RATE_LIMIT_STRICT)
def create_trainee(
    *,
    request: Request,
    db: Session = Depends(get_db),
    trainee_in: TraineeCreate,
) -> Any:
    """
    Create new trainee (user registration). Public endpoint.
    Anyone can register as a trainee.
    
    Rate limit: 3 requests per minute per IP address (strict to prevent spam).
    """
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
    current_user: TraineeModel = Depends(require_trainer),
) -> Any:
    """
    Get list of trainees. Requires trainer or admin role.
    Trainers need to view their trainees.
    """
    trainees = crud_trainee.get_multi(db, skip=skip, limit=limit)
    return trainees


@router.get("/me", response_model=Trainee)
def read_trainee_me(
    db: Session = Depends(get_db),
    current_user: TraineeModel = Depends(get_current_user),
) -> Any:
    """
    Get current user's profile. Requires authentication.
    Users can view their own profile.
    """
    return current_user


@router.get("/{trainee_id}", response_model=Trainee)
def read_trainee(
    trainee_id: int,
    db: Session = Depends(get_db),
    current_user: TraineeModel = Depends(get_current_user),
) -> Any:
    """
    Get trainee by ID. Requires authentication.
    Users can view their own profile, trainers can view all trainees.
    """
    t = crud_trainee.get(db, id=trainee_id)
    if not t:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Trainee not found")
    
    # Authorization: users can only view their own profile unless they're trainer/admin
    if current_user.role == UserRole.TRAINEE and trainee_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Cannot view other users' profiles"
        )
    
    return t


# Protected: users can update own profile, trainers can update any
@router.put("/{trainee_id}", response_model=Trainee)
def update_trainee(
    trainee_id: int,
    trainee_in: TraineeUpdate,
    db: Session = Depends(get_db),
    current_user: TraineeModel = Depends(get_current_user),
) -> Any:
    """
    Update trainee. Requires authentication.
    Users can update their own profile, trainers can update any trainee.
    """
    t = crud_trainee.get(db, id=trainee_id)
    if not t:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Trainee not found")
    
    # Authorization: users can only update their own profile unless they're trainer/admin
    if current_user.role == UserRole.TRAINEE and trainee_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Cannot update other users' profiles"
        )
    
    t = crud_trainee.update(db, db_obj=t, obj_in=trainee_in)
    return t


# Protected: requires trainer or admin role
@router.put("/{trainee_id}/assign-program/{program_id}", response_model=Trainee)
def assign_program_to_trainee(
    trainee_id: int,
    program_id: int,
    db: Session = Depends(get_db),
    current_user: TraineeModel = Depends(require_trainer),
) -> Any:
    """
    Assign program to trainee. Requires trainer or admin role.
    Only trainers can assign programs to trainees.
    """
    trainee = crud_trainee.get(db, id=trainee_id)
    if not trainee:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Trainee not found")

    program = crud_program.get(db, id=program_id)
    if not program:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Program not found")

    trainee_in = TraineeUpdate(program_id=program_id)
    trainee = crud_trainee.update(db, db_obj=trainee, obj_in=trainee_in)
    return trainee


# Protected: requires admin role
@router.delete("/{trainee_id}", response_model=Trainee)
def delete_trainee(
    trainee_id: int,
    db: Session = Depends(get_db),
    current_user: TraineeModel = Depends(require_admin),
) -> Any:
    """
    Delete trainee. Requires admin role.
    Only admins can delete user accounts.
    """
    t = crud_trainee.remove(db, id=trainee_id)
    if not t:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Trainee not found")
    return t

