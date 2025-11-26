from typing import Any, List

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.crud.crud_health_metric import health_metric as crud_health_metric
from app.schemas.health_metric import HealthMetric, HealthMetricCreate, HealthMetricUpdate
from app.api.deps import get_db
from app.auth.deps import get_current_user, require_trainer
from app.models.trainee import Trainee

router = APIRouter()  # Removed duplicate prefix


# Protected: requires authentication - users access own metrics
@router.get("/me", response_model=List[HealthMetric])
def read_my_health_metrics(
    *,
    db: Session = Depends(get_db),
    skip: int = 0,
    limit: int = 100,
    current_user: Trainee = Depends(get_current_user),
) -> Any:
    """
    Get health metrics for the current logged-in user.
    Users can only access their own health metrics.
    """
    health_metrics = crud_health_metric.get_by_trainee(
        db, trainee_id=current_user.id, skip=skip, limit=limit
    )
    return health_metrics


# Protected: requires authentication - users create own metrics
@router.post("/", response_model=HealthMetric)
def create_health_metric(
    *,
    db: Session = Depends(get_db),
    health_metric_in: HealthMetricCreate,
    current_user: Trainee = Depends(get_current_user),
) -> Any:
    """
    Create health metric. Requires authentication.
    Users create metrics for themselves.
    """
    health_metric_obj = crud_health_metric.create(db, obj_in=health_metric_in)
    return health_metric_obj


@router.get("/", response_model=List[HealthMetric])
def read_health_metrics(
    db: Session = Depends(get_db),
    skip: int = 0,
    limit: int = 100,
    current_user: Trainee = Depends(require_trainer),
) -> Any:
    """
    Get all health metrics. Requires trainer or admin role.
    Trainers can view all trainees' health metrics for monitoring.
    """
    health_metrics = crud_health_metric.get_multi(db, skip=skip, limit=limit)
    return health_metrics


@router.get("/{health_metric_id}", response_model=HealthMetric)
def read_health_metric(
    health_metric_id: int,
    db: Session = Depends(get_db),
    current_user: Trainee = Depends(get_current_user),
) -> Any:
    """
    Get health metric by ID. Requires authentication.
    Users can view their own metrics, trainers can view all.
    """
    health_metric_obj = crud_health_metric.get(db, id=health_metric_id)
    if not health_metric_obj:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="HealthMetric not found")
    
    # Authorization: users can only view their own metrics unless they're trainer/admin
    from app.models.user import UserRole
    if current_user.role == UserRole.TRAINEE and health_metric_obj.trainee_id != current_user.id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Cannot access other users' health metrics")
    
    return health_metric_obj


# Protected: requires authentication
@router.put("/{health_metric_id}", response_model=HealthMetric)
def update_health_metric(
    health_metric_id: int,
    health_metric_in: HealthMetricUpdate,
    db: Session = Depends(get_db),
    current_user: Trainee = Depends(get_current_user),
) -> Any:
    """
    Update health metric. Requires authentication.
    Any authenticated user may update.
    """
    health_metric_obj = crud_health_metric.get(db, id=health_metric_id)
    if not health_metric_obj:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="HealthMetric not found")

    health_metric_obj = crud_health_metric.update(db, db_obj=health_metric_obj, obj_in=health_metric_in)
    return health_metric_obj


# Protected: requires authentication
@router.delete("/{health_metric_id}", response_model=HealthMetric)
def delete_health_metric(
    health_metric_id: int,
    db: Session = Depends(get_db),
    current_user: Trainee = Depends(get_current_user),
) -> Any:
    """
    Delete health metric. Requires authentication.
    Any authenticated user may delete.
    """
    health_metric_obj = crud_health_metric.get(db, id=health_metric_id)
    if not health_metric_obj:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="HealthMetric not found")

    health_metric_obj = crud_health_metric.remove(db, id=health_metric_id)
    return health_metric_obj

