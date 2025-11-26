from typing import Any, List, Dict
from datetime import datetime, timedelta

from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from sqlalchemy import func, desc

from app.api.deps import get_db
from app.auth.deps import get_current_user, require_trainer
from app.models.trainee import Trainee as TraineeModel
from app.models.user import UserRole
from app.models.trainer import Trainer
from app.models.workout_session import WorkoutSession
from app.models.exercise_log import ExerciseLog
from app.models.program import Program

router = APIRouter()


@router.get("/me/clients")
def get_my_clients(
    *,
    db: Session = Depends(get_db),
    current_user: TraineeModel = Depends(require_trainer),
    skip: int = 0,
    limit: int = 100
) -> Any:
    """
    Get list of clients (trainees) assigned to the current trainer.
    Requires trainer or admin role.
    
    Returns clients with basic progress metrics:
    - Total workouts completed
    - Last workout date
    - Assigned program
    - Workout adherence rate
    """
    # Get trainer record
    trainer = db.query(Trainer).filter(Trainer.email == current_user.email).first()
    if not trainer and current_user.role != UserRole.ADMIN:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Trainer profile not found"
        )
    
    # If admin, get all trainees; if trainer, get only their trainees
    if current_user.role == UserRole.ADMIN:
        trainees = db.query(TraineeModel).offset(skip).limit(limit).all()
    else:
        trainees = (
            db.query(TraineeModel)
            .filter(TraineeModel.trainer_id == trainer.id)
            .offset(skip)
            .limit(limit)
            .all()
        )
    
    # Build client list with progress metrics
    clients = []
    for trainee in trainees:
        # Total workouts
        total_workouts = (
            db.query(func.count(WorkoutSession.id))
            .filter(WorkoutSession.trainee_id == trainee.id)
            .filter(WorkoutSession.status == "completed")
            .scalar() or 0
        )
        
        # Last workout date
        last_session = (
            db.query(WorkoutSession.session_date)
            .filter(WorkoutSession.trainee_id == trainee.id)
            .order_by(desc(WorkoutSession.session_date))
            .first()
        )
        last_workout_date = last_session[0].isoformat() if last_session else None
        
        # Adherence rate (workouts last 30 days vs expected 12 workouts/month = 3/week)
        thirty_days_ago = datetime.now().date() - timedelta(days=30)
        recent_workouts = (
            db.query(func.count(WorkoutSession.id))
            .filter(WorkoutSession.trainee_id == trainee.id)
            .filter(WorkoutSession.session_date >= thirty_days_ago)
            .scalar() or 0
        )
        adherence_rate = round((recent_workouts / 12) * 100, 1) if recent_workouts > 0 else 0.0
        
        # Program name
        program_name = trainee.program.name if trainee.program else "No program assigned"
        
        clients.append({
            "id": trainee.id,
            "first_name": trainee.first_name,
            "last_name": trainee.last_name,
            "email": trainee.email,
            "program_id": trainee.program_id,
            "program_name": program_name,
            "total_workouts": total_workouts,
            "last_workout_date": last_workout_date,
            "workouts_last_30_days": recent_workouts,
            "adherence_rate": adherence_rate,
            "created_at": trainee.created_at.isoformat() if trainee.created_at else None
        })
    
    return clients


@router.get("/me/clients/{client_id}/progress")
def get_client_progress(
    *,
    db: Session = Depends(get_db),
    client_id: int,
    current_user: TraineeModel = Depends(require_trainer),
    days: int = Query(30, ge=7, le=365)
) -> Any:
    """
    Get detailed progress data for a specific client.
    Requires trainer or admin role.
    
    Returns:
    - Workout frequency over time
    - Volume progression
    - Top exercises
    - Recent sessions
    """
    # Verify trainee exists and belongs to trainer (unless admin)
    trainee = db.query(TraineeModel).filter(TraineeModel.id == client_id).first()
    if not trainee:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Client not found"
        )
    
    # Check trainer authorization (admins can see all)
    if current_user.role == UserRole.TRAINER:
        trainer = db.query(Trainer).filter(Trainer.email == current_user.email).first()
        if trainer and trainee.trainer_id != trainer.id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="You can only view progress of your own clients"
            )
    
    cutoff_date = datetime.now().date() - timedelta(days=days)
    
    # Workout frequency
    sessions = (
        db.query(WorkoutSession.session_date, func.count(WorkoutSession.id).label("count"))
        .filter(WorkoutSession.trainee_id == client_id)
        .filter(WorkoutSession.session_date >= cutoff_date)
        .group_by(WorkoutSession.session_date)
        .order_by(WorkoutSession.session_date)
        .all()
    )
    workout_frequency = [
        {"date": str(s.session_date), "count": s.count}
        for s in sessions
    ]
    
    # Volume trend
    volume_data = (
        db.query(
            WorkoutSession.session_date,
            func.sum(ExerciseLog.volume_kg).label("total_volume")
        )
        .join(ExerciseLog, WorkoutSession.id == ExerciseLog.session_id)
        .filter(WorkoutSession.trainee_id == client_id)
        .filter(WorkoutSession.session_date >= cutoff_date)
        .group_by(WorkoutSession.session_date)
        .order_by(WorkoutSession.session_date)
        .all()
    )
    volume_trend = [
        {"date": str(v.session_date), "volume_kg": float(v.total_volume or 0)}
        for v in volume_data
    ]
    
    # Recent sessions (last 10)
    recent_sessions = (
        db.query(WorkoutSession)
        .filter(WorkoutSession.trainee_id == client_id)
        .order_by(desc(WorkoutSession.session_date))
        .limit(10)
        .all()
    )
    
    sessions_list = []
    for session in recent_sessions:
        exercise_count = (
            db.query(func.count(ExerciseLog.id))
            .filter(ExerciseLog.session_id == session.id)
            .scalar() or 0
        )
        sessions_list.append({
            "id": session.id,
            "date": session.session_date.isoformat(),
            "status": session.status,
            "exercise_count": exercise_count
        })
    
    # Summary stats
    total_workouts = (
        db.query(func.count(WorkoutSession.id))
        .filter(WorkoutSession.trainee_id == client_id)
        .filter(WorkoutSession.status == "completed")
        .scalar() or 0
    )
    
    total_volume = (
        db.query(func.sum(ExerciseLog.volume_kg))
        .join(WorkoutSession, ExerciseLog.session_id == WorkoutSession.id)
        .filter(WorkoutSession.trainee_id == client_id)
        .scalar() or 0
    )
    
    return {
        "client": {
            "id": trainee.id,
            "name": f"{trainee.first_name} {trainee.last_name}",
            "email": trainee.email,
            "program": trainee.program.name if trainee.program else None
        },
        "summary": {
            "total_workouts": total_workouts,
            "total_volume_kg": float(total_volume),
            "timeframe_days": days
        },
        "workout_frequency": workout_frequency,
        "volume_trend": volume_trend,
        "recent_sessions": sessions_list
    }


@router.get("/me/dashboard-stats")
def get_trainer_dashboard_stats(
    *,
    db: Session = Depends(get_db),
    current_user: TraineeModel = Depends(require_trainer),
) -> Any:
    """
    Get high-level stats for trainer dashboard.
    
    Returns:
    - Total clients
    - Active clients (worked out in last 7 days)
    - Total programs created
    - Average client adherence rate
    """
    # Get trainer record
    trainer = db.query(Trainer).filter(Trainer.email == current_user.email).first()
    if not trainer and current_user.role != UserRole.ADMIN:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Trainer profile not found"
        )
    
    # Total clients
    if current_user.role == UserRole.ADMIN:
        total_clients = db.query(func.count(TraineeModel.id)).scalar() or 0
        clients_query = db.query(TraineeModel.id)
    else:
        total_clients = (
            db.query(func.count(TraineeModel.id))
            .filter(TraineeModel.trainer_id == trainer.id)
            .scalar() or 0
        )
        clients_query = db.query(TraineeModel.id).filter(TraineeModel.trainer_id == trainer.id)
    
    # Active clients (worked out in last 7 days)
    seven_days_ago = datetime.now().date() - timedelta(days=7)
    active_client_ids = (
        db.query(WorkoutSession.trainee_id)
        .filter(WorkoutSession.session_date >= seven_days_ago)
        .distinct()
        .all()
    )
    active_client_ids_set = {cid[0] for cid in active_client_ids}
    
    my_client_ids = [cid[0] for cid in clients_query.all()]
    active_clients = len([cid for cid in my_client_ids if cid in active_client_ids_set])
    
    # Total programs
    if current_user.role == UserRole.ADMIN:
        total_programs = db.query(func.count(Program.id)).scalar() or 0
    else:
        total_programs = (
            db.query(func.count(Program.id))
            .filter(Program.trainer_id == trainer.id)
            .scalar() or 0
        )
    
    # Average adherence rate (workouts last 30 days)
    thirty_days_ago = datetime.now().date() - timedelta(days=30)
    adherence_rates = []
    
    for client_id in my_client_ids:
        recent_workouts = (
            db.query(func.count(WorkoutSession.id))
            .filter(WorkoutSession.trainee_id == client_id)
            .filter(WorkoutSession.session_date >= thirty_days_ago)
            .scalar() or 0
        )
        adherence = (recent_workouts / 12) * 100 if recent_workouts > 0 else 0
        adherence_rates.append(adherence)
    
    avg_adherence = round(sum(adherence_rates) / len(adherence_rates), 1) if adherence_rates else 0.0
    
    return {
        "total_clients": total_clients,
        "active_clients": active_clients,
        "total_programs": total_programs,
        "average_adherence_rate": avg_adherence
    }
