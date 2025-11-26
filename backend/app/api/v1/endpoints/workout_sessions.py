from typing import Any, Generator
from datetime import date

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.crud.crud_workout_session import workout_session as crud_workout_session
from app.schemas.workout_session import WorkoutSession, WorkoutSessionCreate, WorkoutSessionUpdate
from app.schemas.exercise_log import ExerciseLog, ExerciseLogCreate
from app.crud.crud_exercise_log import exercise_log as crud_exercise_log
from app.api.deps import get_db
from app.schemas.enums import WorkoutSessionStatus
from app.auth.deps import get_current_user
from app.models.trainee import Trainee

router = APIRouter()  # Removed duplicate prefix

# Protected: requires authentication
@router.get("/", response_model=list[WorkoutSession])
def read_workout_sessions(
    *,
    db: Session = Depends(get_db),
    skip: int = 0,
    limit: int = 100,
    current_user: Trainee = Depends(get_current_user),
) -> Any:
    """
    Retrieve workout sessions for the current user.
    
    Returns sessions ordered by session_date descending (most recent first).
    """
    sessions = crud_workout_session.get_multi_by_trainee(
        db, trainee_id=current_user.id, skip=skip, limit=limit
    )
    return sessions


# Protected: requires authentication
@router.post("/start", response_model=WorkoutSession)
def start_workout_session(
    *,
    db: Session = Depends(get_db),
    session_in: WorkoutSessionCreate,
    current_user: Trainee = Depends(get_current_user),
) -> Any:
    """
    Start a new workout session.
    Users can only start sessions for themselves.

    - **trainee_id**: ID of the trainee starting the session.
    - **program_id**: ID of the program for the session.

    Example Request:
    ```json
    {
        "trainee_id": 1,
        "program_id": 1
    }
    ```

    Example Response:
    ```json
    {
        "id": 1,
        "trainee_id": 1,
        "program_id": 1,
        "session_date": "2025-11-04",
        "status": "in-progress",
        "exercise_logs": []
    }
    ```
    """
    # Authorization: users can only create sessions for themselves
    from app.models.user import UserRole
    if current_user.role == UserRole.TRAINEE and session_in.trainee_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Cannot create workout sessions for other users"
        )
    
    # Create a WorkoutSessionCreate object with the provided data
    # and set the session_date to the current date and status to "in-progress"
    from app.schemas.workout_session import WorkoutSessionBase
    session_to_create = WorkoutSessionBase(
        trainee_id=session_in.trainee_id,
        program_id=session_in.program_id,
        session_date=date.today(),
        status=WorkoutSessionStatus.IN_PROGRESS,
    )

    session = crud_workout_session.create(db, obj_in=session_to_create)
    return session


# Protected: requires authentication
@router.post("/{session_id}/log-exercise", response_model=ExerciseLog)
def log_exercise_in_session(
    session_id: int,
    *,
    db: Session = Depends(get_db),
    exercise_log_in: ExerciseLogCreate,
    current_user: Trainee = Depends(get_current_user),
) -> Any:
    """
    Log an exercise in a workout session.

    - **session_id**: ID of the workout session.
    - **exercise_id**: ID of the exercise being logged.
    - **completed_sets**: Number of sets completed.
    - **completed_reps**: Number of reps completed.
    - **completed_weight_kg**: Weight completed in kg.

    Example Request:
    ```json
    {
        "exercise_id": 1,
        "completed_sets": 3,
        "completed_reps": 10,
        "completed_weight_kg": 50
    }
    ```

    Example Response:
    ```json
    {
        "id": 1,
        "session_id": 1,
        "exercise_id": 1,
        "completed_sets": 3,
        "completed_reps": 10,
        "completed_weight_kg": 50,
        "volume_kg": 1500,
        "is_completed": true,
        "logged_at": "2025-11-04T12:00:00.000Z"
    }
    ```
    """
    session = crud_workout_session.get(db, id=session_id)
    if not session:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Workout session not found")
    
    # Authorization: users can only log exercises in their own sessions
    from app.models.user import UserRole
    if current_user.role == UserRole.TRAINEE and session.trainee_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Cannot log exercises in other users' workout sessions"
        )
    
    # Cast to Any to avoid SQLAlchemy type-check confusion on InstrumentedAttributes
    from typing import Any as _Any
    _session: _Any = session
    if _session.status != WorkoutSessionStatus.IN_PROGRESS:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Workout session is not in-progress")

    # Calculate volume defensively in case optional fields are not provided
    sets = exercise_log_in.completed_sets or 0
    reps = exercise_log_in.completed_reps or 0
    weight = exercise_log_in.completed_weight_kg or 0.0
    volume = sets * reps * weight

    from app.schemas.exercise_log import ExerciseLogCreate
    exercise_log_to_create = ExerciseLogCreate(
        session_id=session_id,
        exercise_id=exercise_log_in.exercise_id,
        completed_sets=exercise_log_in.completed_sets,
        completed_reps=exercise_log_in.completed_reps,
        completed_weight_kg=exercise_log_in.completed_weight_kg,
        volume_kg=volume,
        is_completed=True,
    )

    exercise_log = crud_exercise_log.create(db, obj_in=exercise_log_to_create)
    return exercise_log


# Protected: requires authentication
@router.put("/{session_id}/end", response_model=WorkoutSession)
def end_workout_session(
    session_id: int,
    *,
    db: Session = Depends(get_db),
    current_user: Trainee = Depends(get_current_user),
) -> Any:
    """
    End a workout session.

    - **session_id**: ID of the workout session to end.

    Example Response:
    ```json
    {
        "id": 1,
        "trainee_id": 1,
        "program_id": 1,
        "session_date": "2025-11-04",
        "status": "completed",
        "exercise_logs": [
            {
                "id": 1,
                "session_id": 1,
                "exercise_id": 1,
                "completed_sets": 3,
                "completed_reps": 10,
                "completed_weight_kg": 50,
                "volume_kg": 1500,
                "is_completed": true,
                "logged_at": "2025-11-04T12:00:00.000Z"
            }
        ]
    }
    ```
    """
    session = crud_workout_session.get(db, id=session_id)
    if not session:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Workout session not found")
    
    # Authorization: users can only end their own sessions
    from app.models.user import UserRole
    if current_user.role == UserRole.TRAINEE and session.trainee_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Cannot end other users' workout sessions"
        )
    
    from typing import Any as _Any
    _session: _Any = session
    if _session.status != "in-progress":
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Workout session is not in-progress")

    session_update = WorkoutSessionUpdate(status=WorkoutSessionStatus.COMPLETED)
    session = crud_workout_session.update(db, db_obj=session, obj_in=session_update)
    return session


# Protected: requires authentication
@router.post("/{session_id}/auto-complete", response_model=WorkoutSession)
def auto_complete_session(
    session_id: int,
    *,
    db: Session = Depends(get_db),
    current_user: Trainee = Depends(get_current_user),
) -> Any:
    """
    Automatically complete a workout session by logging all exercises from the program.
    This is a "One-Click Complete" feature for trainer-assigned programs.
    """
    session = crud_workout_session.get(db, id=session_id)
    if not session:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Workout session not found")
    
    # Authorization
    from app.models.user import UserRole
    if current_user.role == UserRole.TRAINEE and session.trainee_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Cannot auto-complete other users' workout sessions"
        )
    
    if not session.program_id:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, 
            detail="Cannot auto-complete a session without a linked program"
        )

    # Fetch program exercises
    from app.models.program_exercise import ProgramExercise
    program_exercises = db.query(ProgramExercise).filter(ProgramExercise.program_id == session.program_id).all()
    
    if not program_exercises:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Linked program has no exercises to log"
        )

    # Log each exercise
    from app.schemas.exercise_log import ExerciseLogCreate
    for p_ex in program_exercises:
        # Calculate volume if possible
        sets = p_ex.prescribed_sets or 0
        reps = p_ex.prescribed_reps or 0
        weight = p_ex.prescribed_weight_kg or 0.0
        volume = sets * reps * weight
        
        log_in = ExerciseLogCreate(
            session_id=session_id,
            exercise_id=p_ex.exercise_id,
            completed_sets=sets,
            completed_reps=reps,
            completed_weight_kg=weight,
            completed_duration_minutes=p_ex.prescribed_duration_minutes,
            volume_kg=volume,
            is_completed=True
        )
        crud_exercise_log.create(db, obj_in=log_in)

    # Mark session as completed
    session_update = WorkoutSessionUpdate(status=WorkoutSessionStatus.COMPLETED)
    session = crud_workout_session.update(db, db_obj=session, obj_in=session_update)
    return session


@router.get("/{session_id}", response_model=WorkoutSession)
def read_workout_session(
    session_id: int,
    db: Session = Depends(get_db),
    current_user: Trainee = Depends(get_current_user),
) -> Any:
    """
    Get workout session by ID. Requires authentication.
    Users can only view their own sessions, trainers can view all.

    - **session_id**: ID of the workout session to retrieve.

    Example Response:
    ```json
    {
        "id": 1,
        "trainee_id": 1,
        "program_id": 1,
        "session_date": "2025-11-04",
        "status": "completed",
        "exercise_logs": [
            {
                "id": 1,
                "session_id": 1,
                "exercise_id": 1,
                "completed_sets": 3,
                "completed_reps": 10,
                "completed_weight_kg": 50,
                "volume_kg": 1500,
                "is_completed": true,
                "logged_at": "2025-11-04T12:00:00.000Z"
            }
        ]
    }
    ```
    """
    session = crud_workout_session.get(db, id=session_id)
    if not session:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Workout session not found")
    
    # Authorization: users can only view their own sessions unless they're trainer/admin
    from app.models.user import UserRole
    if current_user.role == UserRole.TRAINEE and session.trainee_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Cannot view other users' workout sessions"
        )
    
    return session