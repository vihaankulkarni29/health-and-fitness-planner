from typing import Any, List, Dict
from datetime import datetime, timedelta
from collections import defaultdict

from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from sqlalchemy import func, desc

from app.api.deps import get_db
from app.auth.deps import get_current_user
from app.models.trainee import Trainee
from app.models.exercise_log import ExerciseLog
from app.models.exercise import Exercise
from app.models.workout_session import WorkoutSession

router = APIRouter()


@router.get("/me/exercise-frequency")
def get_exercise_frequency(
    *,
    db: Session = Depends(get_db),
    current_user: Trainee = Depends(get_current_user),
    days: int = Query(30, ge=7, le=365, description="Number of days to analyze (7-365)")
) -> Any:
    """
    Get exercise frequency data for the current user over specified time period.
    Returns weekly and monthly breakdown of exercise counts.
    
    Response format:
    {
        "daily": [{"date": "2025-11-07", "count": 5}, ...],
        "weekly_total": 12,
        "monthly_total": 45
    }
    """
    cutoff_date = datetime.now().date() - timedelta(days=days)
    
    # Get all exercise logs for the user within the time period
    logs = (
        db.query(ExerciseLog, WorkoutSession)
        .join(WorkoutSession, ExerciseLog.session_id == WorkoutSession.id)
        .filter(WorkoutSession.trainee_id == current_user.id)
        .filter(WorkoutSession.session_date >= cutoff_date)
        .all()
    )
    
    # Group by date
    daily_counts = defaultdict(int)
    for log, session in logs:
        date_str = session.session_date.isoformat()
        daily_counts[date_str] += 1
    
    # Convert to list of dicts sorted by date
    daily = [{"date": date, "count": count} for date, count in sorted(daily_counts.items())]
    
    weekly_cutoff = datetime.now().date() - timedelta(days=7)
    monthly_cutoff = datetime.now().date() - timedelta(days=30)
    
    weekly_total = sum(
        count for date, count in daily_counts.items()
        if datetime.fromisoformat(date).date() >= weekly_cutoff
    )
    monthly_total = sum(count for count in daily_counts.values())
    
    return {
        "daily": daily,
        "weekly_total": weekly_total,
        "monthly_total": monthly_total
    }


@router.get("/me/top-exercises")
def get_top_exercises(
    *,
    db: Session = Depends(get_db),
    current_user: Trainee = Depends(get_current_user),
    days: int = Query(30, ge=7, le=365, description="Number of days to analyze (7-365)"),
    limit: int = Query(10, ge=1, le=50, description="Number of top exercises to return")
) -> Any:
    """
    Get most performed exercises for the current user.
    
    Response format:
    [
        {
            "exercise_id": 1,
            "exercise_name": "Bench Press",
            "count": 15,
            "total_volume_kg": 4500.0,
            "avg_weight_kg": 75.0
        },
        ...
    ]
    """
    cutoff_date = datetime.now().date() - timedelta(days=days)
    
    results = (
        db.query(
            Exercise.id,
            Exercise.name,
            func.count(ExerciseLog.id).label("count"),
            func.sum(ExerciseLog.volume_kg).label("total_volume"),
            func.avg(ExerciseLog.completed_weight_kg).label("avg_weight")
        )
        .join(ExerciseLog, Exercise.id == ExerciseLog.exercise_id)
        .join(WorkoutSession, ExerciseLog.session_id == WorkoutSession.id)
        .filter(WorkoutSession.trainee_id == current_user.id)
        .filter(WorkoutSession.session_date >= cutoff_date)
        .group_by(Exercise.id, Exercise.name)
        .order_by(desc("count"))
        .limit(limit)
        .all()
    )
    
    return [
        {
            "exercise_id": row.id,
            "exercise_name": row.name,
            "count": row.count,
            "total_volume_kg": float(row.total_volume or 0),
            "avg_weight_kg": float(row.avg_weight or 0)
        }
        for row in results
    ]


@router.get("/me/volume-trend")
def get_volume_trend(
    *,
    db: Session = Depends(get_db),
    current_user: Trainee = Depends(get_current_user),
    days: int = Query(30, ge=7, le=365, description="Number of days to analyze (7-365)")
) -> Any:
    """
    Get total training volume trend over time.
    
    Response format:
    [
        {"date": "2025-11-07", "volume_kg": 2500.5},
        ...
    ]
    """
    cutoff_date = datetime.now().date() - timedelta(days=days)
    
    results = (
        db.query(
            WorkoutSession.session_date,
            func.sum(ExerciseLog.volume_kg).label("daily_volume")
        )
        .join(ExerciseLog, WorkoutSession.id == ExerciseLog.session_id)
        .filter(WorkoutSession.trainee_id == current_user.id)
        .filter(WorkoutSession.session_date >= cutoff_date)
        .group_by(WorkoutSession.session_date)
        .order_by(WorkoutSession.session_date)
        .all()
    )
    
    return [
        {
            "date": row.session_date.isoformat(),
            "volume_kg": float(row.daily_volume or 0)
        }
        for row in results
    ]


@router.get("/me/personal-records")
def get_personal_records(
    *,
    db: Session = Depends(get_db),
    current_user: Trainee = Depends(get_current_user),
) -> Any:
    """
    Get personal records (max weight) for each exercise.
    
    Response format:
    [
        {
            "exercise_id": 1,
            "exercise_name": "Bench Press",
            "max_weight_kg": 100.0,
            "achieved_date": "2025-11-07",
            "sets": 3,
            "reps": 5
        },
        ...
    ]
    """
    # Subquery to get max weight per exercise
    subq = (
        db.query(
            ExerciseLog.exercise_id,
            func.max(ExerciseLog.completed_weight_kg).label("max_weight")
        )
        .join(WorkoutSession, ExerciseLog.session_id == WorkoutSession.id)
        .filter(WorkoutSession.trainee_id == current_user.id)
        .group_by(ExerciseLog.exercise_id)
        .subquery()
    )
    
    # Get full details of PR logs
    results = (
        db.query(
            Exercise.id,
            Exercise.name,
            ExerciseLog.completed_weight_kg,
            WorkoutSession.session_date,
            ExerciseLog.completed_sets,
            ExerciseLog.completed_reps
        )
        .join(ExerciseLog, Exercise.id == ExerciseLog.exercise_id)
        .join(WorkoutSession, ExerciseLog.session_id == WorkoutSession.id)
        .join(
            subq,
            (Exercise.id == subq.c.exercise_id) &
            (ExerciseLog.completed_weight_kg == subq.c.max_weight)
        )
        .filter(WorkoutSession.trainee_id == current_user.id)
        .order_by(desc(ExerciseLog.completed_weight_kg))
        .all()
    )
    
    # Deduplicate (in case same PR achieved multiple times, take most recent)
    seen = set()
    prs = []
    for row in results:
        if row.id not in seen:
            seen.add(row.id)
            prs.append({
                "exercise_id": row.id,
                "exercise_name": row.name,
                "max_weight_kg": float(row.completed_weight_kg or 0),
                "achieved_date": row.session_date.isoformat(),
                "sets": row.completed_sets or 0,
                "reps": row.completed_reps or 0
            })
    
    return prs


@router.get("/me/summary")
def get_analytics_summary(
    *,
    db: Session = Depends(get_db),
    current_user: Trainee = Depends(get_current_user),
) -> Any:
    """
    Get high-level analytics summary for dashboard cards.
    
    Response format:
    {
        "total_workouts": 25,
        "total_exercises_logged": 150,
        "total_volume_kg": 45000.0,
        "current_streak_days": 5,
        "workouts_this_week": 3,
        "workouts_this_month": 12
    }
    """
    # Total workouts (completed sessions)
    total_workouts = (
        db.query(func.count(WorkoutSession.id))
        .filter(WorkoutSession.trainee_id == current_user.id)
        .filter(WorkoutSession.status == "completed")
        .scalar() or 0
    )
    
    # Total exercises logged
    total_exercises = (
        db.query(func.count(ExerciseLog.id))
        .join(WorkoutSession, ExerciseLog.session_id == WorkoutSession.id)
        .filter(WorkoutSession.trainee_id == current_user.id)
        .scalar() or 0
    )
    
    # Total volume
    total_volume = (
        db.query(func.sum(ExerciseLog.volume_kg))
        .join(WorkoutSession, ExerciseLog.session_id == WorkoutSession.id)
        .filter(WorkoutSession.trainee_id == current_user.id)
        .scalar() or 0
    )
    
    # Workouts this week
    week_ago = datetime.now().date() - timedelta(days=7)
    workouts_week = (
        db.query(func.count(WorkoutSession.id))
        .filter(WorkoutSession.trainee_id == current_user.id)
        .filter(WorkoutSession.session_date >= week_ago)
        .scalar() or 0
    )
    
    # Workouts this month
    month_ago = datetime.now().date() - timedelta(days=30)
    workouts_month = (
        db.query(func.count(WorkoutSession.id))
        .filter(WorkoutSession.trainee_id == current_user.id)
        .filter(WorkoutSession.session_date >= month_ago)
        .scalar() or 0
    )
    
    # Current streak (consecutive days with workouts)
    all_sessions = (
        db.query(WorkoutSession.session_date)
        .filter(WorkoutSession.trainee_id == current_user.id)
        .order_by(desc(WorkoutSession.session_date))
        .all()
    )
    
    streak = 0
    if all_sessions:
        session_dates = sorted(set(s.session_date for s in all_sessions), reverse=True)
        current_date = datetime.now().date()
        
        for session_date in session_dates:
            if session_date == current_date or (current_date - session_date).days <= 1:
                streak += 1
                current_date = session_date
            else:
                break
    
    return {
        "total_workouts": total_workouts,
        "total_exercises_logged": total_exercises,
        "total_volume_kg": float(total_volume),
        "current_streak_days": streak,
        "workouts_this_week": workouts_week,
        "workouts_this_month": workouts_month
    }
