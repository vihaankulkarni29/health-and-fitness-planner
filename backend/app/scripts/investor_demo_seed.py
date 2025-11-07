"""
Investor Demo Data Seeding Script
Generates 1 year of realistic workout data for demo purposes.

Trainee: Vihaan Kulkarni (consistent gym-goer)
Trainer: Rohit Wagh (certified strength coach)

Run:
    python -m app.scripts.investor_demo_seed
"""
import random
from datetime import datetime, timedelta, date
from sqlalchemy.orm import Session
from app.db.session import SessionLocal, engine
from app.db.base import Base
from app.models.trainer import Trainer
from app.models.trainee import Trainee
from app.models.exercise import Exercise
from app.models.program import Program
from app.models.program_exercise import ProgramExercise
from app.models.workout_session import WorkoutSession
from app.models.exercise_log import ExerciseLog
from app.models.health_metric import HealthMetric
from app.auth.token import get_password_hash

# Demo credentials
TRAINER_EMAIL = "rohit.wagh@fitnessdemo.com"
TRAINER_PASSWORD = "trainer123"
TRAINEE_EMAIL = "vihaan.kulkarni@fitnessdemo.com"
TRAINEE_PASSWORD = "trainee123"

# Seed for reproducibility
random.seed(42)

# Exercise library with realistic progressions
EXERCISES = [
    # Compound Movements (Primary)
    {"name": "Barbell Back Squat", "description": "King of leg exercises", "start_weight": 80, "progression_rate": 1.5},
    {"name": "Conventional Deadlift", "description": "Full body power", "start_weight": 100, "progression_rate": 1.8},
    {"name": "Barbell Bench Press", "description": "Upper body strength", "start_weight": 70, "progression_rate": 1.2},
    {"name": "Overhead Press", "description": "Shoulder strength", "start_weight": 45, "progression_rate": 0.8},
    {"name": "Barbell Row", "description": "Back thickness", "start_weight": 65, "progression_rate": 1.2},
    {"name": "Pull-ups", "description": "Bodyweight back exercise", "start_weight": 0, "progression_rate": 2.5},
    
    # Compound Accessories
    {"name": "Romanian Deadlift", "description": "Hamstring developer", "start_weight": 70, "progression_rate": 1.3},
    {"name": "Front Squat", "description": "Quad emphasis", "start_weight": 60, "progression_rate": 1.2},
    {"name": "Incline Bench Press", "description": "Upper chest", "start_weight": 55, "progression_rate": 1.0},
    {"name": "Dumbbell Bench Press", "description": "Chest stabilization", "start_weight": 25, "progression_rate": 1.0},
    {"name": "Leg Press", "description": "Quad mass builder", "start_weight": 120, "progression_rate": 3.0},
    
    # Upper Body Accessories
    {"name": "Dumbbell Shoulder Press", "description": "Shoulder mass", "start_weight": 20, "progression_rate": 0.7},
    {"name": "Lateral Raises", "description": "Side delts", "start_weight": 10, "progression_rate": 0.4},
    {"name": "Cable Fly", "description": "Chest isolation", "start_weight": 15, "progression_rate": 0.6},
    {"name": "Tricep Pushdowns", "description": "Tricep isolation", "start_weight": 25, "progression_rate": 0.8},
    {"name": "Barbell Curl", "description": "Bicep mass", "start_weight": 30, "progression_rate": 0.6},
    {"name": "Hammer Curls", "description": "Bicep and forearm", "start_weight": 15, "progression_rate": 0.5},
    {"name": "Face Pulls", "description": "Rear delt and health", "start_weight": 20, "progression_rate": 0.5},
    
    # Lower Body Accessories
    {"name": "Bulgarian Split Squat", "description": "Unilateral leg", "start_weight": 20, "progression_rate": 0.8},
    {"name": "Leg Curls", "description": "Hamstring isolation", "start_weight": 35, "progression_rate": 0.9},
    {"name": "Leg Extensions", "description": "Quad isolation", "start_weight": 40, "progression_rate": 0.9},
    {"name": "Calf Raises", "description": "Calf development", "start_weight": 80, "progression_rate": 1.5},
    {"name": "Walking Lunges", "description": "Functional leg", "start_weight": 15, "progression_rate": 0.7},
    
    # Core
    {"name": "Plank", "description": "Core stability", "start_weight": 0, "progression_rate": 0},
    {"name": "Ab Wheel Rollout", "description": "Advanced core", "start_weight": 0, "progression_rate": 0},
    {"name": "Cable Crunches", "description": "Ab development", "start_weight": 30, "progression_rate": 0.8},
]

# Program structure (4-day split)
PROGRAM_STRUCTURE = {
    "Day 1 - Lower Power": [
        ("Barbell Back Squat", 5, 5, 1),
        ("Romanian Deadlift", 4, 6, 2),
        ("Leg Press", 4, 10, 3),
        ("Leg Curls", 3, 12, 4),
        ("Calf Raises", 4, 15, 5),
    ],
    "Day 2 - Upper Power": [
        ("Barbell Bench Press", 5, 5, 1),
        ("Barbell Row", 5, 5, 2),
        ("Overhead Press", 4, 6, 3),
        ("Pull-ups", 3, 8, 4),
        ("Barbell Curl", 3, 10, 5),
        ("Tricep Pushdowns", 3, 12, 6),
    ],
    "Day 3 - Lower Hypertrophy": [
        ("Front Squat", 4, 8, 1),
        ("Romanian Deadlift", 4, 10, 2),
        ("Bulgarian Split Squat", 3, 12, 3),
        ("Leg Extensions", 3, 15, 4),
        ("Leg Curls", 3, 15, 5),
        ("Calf Raises", 4, 20, 6),
    ],
    "Day 4 - Upper Hypertrophy": [
        ("Incline Bench Press", 4, 8, 1),
        ("Dumbbell Shoulder Press", 4, 10, 2),
        ("Cable Fly", 3, 12, 3),
        ("Lateral Raises", 4, 15, 4),
        ("Face Pulls", 3, 15, 5),
        ("Hammer Curls", 3, 12, 6),
        ("Cable Crunches", 3, 15, 7),
    ],
}


def clear_demo_data(db: Session):
    """Clear existing demo data."""
    print("🗑️  Clearing existing demo data...")
    
    # Delete in reverse order of dependencies
    trainee = db.query(Trainee).filter(Trainee.email == TRAINEE_EMAIL).first()
    if trainee:
        db.query(HealthMetric).filter(HealthMetric.trainee_id == trainee.id).delete()
        db.query(ExerciseLog).join(WorkoutSession).filter(WorkoutSession.trainee_id == trainee.id).delete(synchronize_session=False)
        db.query(WorkoutSession).filter(WorkoutSession.trainee_id == trainee.id).delete()
        db.query(Trainee).filter(Trainee.id == trainee.id).delete()
    
    trainer = db.query(Trainer).filter(Trainer.email == TRAINER_EMAIL).first()
    if trainer:
        db.query(ProgramExercise).join(Program).filter(Program.trainer_id == trainer.id).delete(synchronize_session=False)
        db.query(Program).filter(Program.trainer_id == trainer.id).delete()
        db.query(Trainer).filter(Trainer.id == trainer.id).delete()
    
    db.commit()
    print("✅ Demo data cleared")


def create_exercises(db: Session) -> dict:
    """Create exercise library."""
    print("💪 Creating exercise library...")
    
    exercise_map = {}
    for ex_data in EXERCISES:
        existing = db.query(Exercise).filter(Exercise.name == ex_data["name"]).first()
        if existing:
            exercise_map[ex_data["name"]] = existing
        else:
            exercise = Exercise(
                name=ex_data["name"],
                description=ex_data["description"],
                video_url=f"https://youtube.com/watch?v={ex_data['name'].replace(' ', '_')}"
            )
            db.add(exercise)
            db.flush()
            exercise_map[ex_data["name"]] = exercise
    
    db.commit()
    print(f"✅ Created {len(exercise_map)} exercises")
    return exercise_map


def create_trainer(db: Session) -> tuple[Trainer, Trainee]:
    """Create trainer profile (both Trainer entity and Trainee with TRAINER role)."""
    print("👨‍🏫 Creating trainer...")
    
    # Create Trainer entity (for program ownership)
    trainer_entity = Trainer(
        first_name="Rohit",
        last_name="Wagh",
        email=TRAINER_EMAIL
    )
    db.add(trainer_entity)
    db.flush()
    
    # Create Trainee with TRAINER role (for authentication)
    trainer_user = Trainee(
        first_name="Rohit",
        last_name="Wagh",
        email=TRAINER_EMAIL,
        hashed_password=get_password_hash(TRAINER_PASSWORD),
        role="TRAINER"
    )
    db.add(trainer_user)
    db.commit()
    db.refresh(trainer_entity)
    db.refresh(trainer_user)
    
    print(f"✅ Created trainer: {trainer_user.first_name} {trainer_user.last_name} (ID: {trainer_entity.id})")
    return trainer_entity, trainer_user


def create_program(db: Session, trainer: Trainer, exercise_map: dict) -> Program:
    """Create training program."""
    print("📋 Creating program...")
    
    program = Program(
        name="12-Month Strength & Hypertrophy Program",
        description="Progressive overload program focusing on compound movements and strategic periodization",
        trainer_id=trainer.id
    )
    db.add(program)
    db.flush()
    
    # Add all exercises to program
    order = 1
    for day_name, exercises in PROGRAM_STRUCTURE.items():
        for ex_name, sets, reps, _ in exercises:
            if ex_name in exercise_map:
                ex_data = next(e for e in EXERCISES if e["name"] == ex_name)
                program_exercise = ProgramExercise(
                    program_id=program.id,
                    exercise_id=exercise_map[ex_name].id,
                    order=order,
                    prescribed_sets=sets,
                    prescribed_reps=reps,
                    prescribed_weight_kg=ex_data["start_weight"]
                )
                db.add(program_exercise)
                order += 1
    
    db.commit()
    db.refresh(program)
    
    print(f"✅ Created program: {program.name} (ID: {program.id})")
    return program


def create_trainee(db: Session, trainer: Trainer, program: Program) -> Trainee:
    """Create trainee profile."""
    print("🏃 Creating trainee...")
    
    trainee = Trainee(
        first_name="Vihaan",
        last_name="Kulkarni",
        email=TRAINEE_EMAIL,
        hashed_password=get_password_hash(TRAINEE_PASSWORD),
        trainer_id=trainer.id,
        program_id=program.id,
        role="TRAINEE"
    )
    db.add(trainee)
    db.commit()
    db.refresh(trainee)
    
    print(f"✅ Created trainee: {trainee.first_name} {trainee.last_name} (ID: {trainee.id})")
    return trainee


def generate_workout_schedule(start_date: date, days: int = 365) -> list:
    """Generate realistic workout schedule (4x per week with variance)."""
    print("📅 Generating workout schedule...")
    
    schedule = []
    current_date = start_date
    week = 0
    
    # Training days: Monday(0), Wednesday(2), Friday(4), Saturday(5)
    training_days = [0, 2, 4, 5]
    day_cycle = 0
    
    while len(schedule) < days:
        week += 1
        week_start = current_date
        
        # Determine adherence for this week
        skip_week = False
        
        # Vacation breaks (2 full weeks per year)
        if week in [20, 40]:  # Week 20 (May) and Week 40 (October)
            skip_week = True
        
        # Holiday breaks (random days)
        if week in [1, 52]:  # New Year and Christmas
            if random.random() < 0.5:
                skip_week = True
        
        if skip_week:
            current_date += timedelta(days=7)
            continue
        
        # Generate 4 workouts for the week
        for day_offset in training_days:
            workout_date = week_start + timedelta(days=day_offset)
            
            # Skip some sessions randomly (15% skip rate)
            if random.random() < 0.15:
                continue
            
            # Determine day type
            day_name = list(PROGRAM_STRUCTURE.keys())[day_cycle % 4]
            
            # Determine status
            if workout_date > datetime.now().date():
                status = "planned"
            elif random.random() < 0.05:  # 5% in_progress
                status = "in_progress"
            else:
                status = "completed"
            
            schedule.append({
                "date": workout_date,
                "day_name": day_name,
                "status": status,
                "week": week
            })
            
            day_cycle += 1
        
        current_date += timedelta(days=7)
    
    print(f"✅ Generated {len(schedule)} workout sessions")
    return schedule[:220]  # Cap at ~220 sessions


def calculate_progression(base_weight: float, week: int, progression_rate: float, is_deload: bool = False) -> float:
    """Calculate weight with progressive overload."""
    if base_weight == 0:  # Bodyweight exercises
        return 0
    
    if is_deload:
        return base_weight * 0.7  # 30% reduction for deload
    
    # Linear progression with diminishing returns
    weeks_factor = min(week * 0.15, 20)  # Cap progression
    progression = base_weight + (progression_rate * weeks_factor)
    
    # Round to nearest 2.5kg
    return round(progression / 2.5) * 2.5


def add_natural_variance(weight: float, variance: float = 0.05) -> float:
    """Add realistic day-to-day variance."""
    multiplier = random.uniform(1 - variance, 1 + variance)
    varied = weight * multiplier
    return round(varied / 2.5) * 2.5


def generate_exercise_logs(db: Session, sessions: list, program: Program, exercise_map: dict):
    """Generate exercise logs for all sessions."""
    print("📊 Generating exercise logs...")
    
    total_logs = 0
    exercise_data_map = {e["name"]: e for e in EXERCISES}
    
    for session_info in sessions:
        # Get exercises for this day
        day_exercises = PROGRAM_STRUCTURE[session_info["day_name"]]
        week = session_info["week"]
        
        # Check if deload week (every 8 weeks)
        is_deload = (week % 8 == 0)
        
        # Determine performance variance
        if random.random() < 0.1:  # 10% bad days
            performance_multiplier = 0.9
        elif random.random() < 0.15:  # 15% great days
            performance_multiplier = 1.05
        else:
            performance_multiplier = 1.0
        
        for ex_name, prescribed_sets, prescribed_reps, _ in day_exercises:
            if ex_name not in exercise_map:
                continue
            
            exercise = exercise_map[ex_name]
            ex_data = exercise_data_map[ex_name]
            
            # Calculate current working weight
            base_weight = ex_data["start_weight"]
            progression_rate = ex_data["progression_rate"]
            current_weight = calculate_progression(base_weight, week, progression_rate, is_deload)
            current_weight = add_natural_variance(current_weight)
            current_weight *= performance_multiplier
            current_weight = round(current_weight / 2.5) * 2.5
            
            # Vary reps slightly
            completed_reps = prescribed_reps
            if random.random() < 0.3:  # 30% chance of variance
                completed_reps += random.randint(-1, 1)
                completed_reps = max(1, completed_reps)
            
            # Sometimes miss sets on bad days
            completed_sets = prescribed_sets
            if performance_multiplier < 1.0 and random.random() < 0.2:
                completed_sets -= 1
            
            # Calculate volume
            volume = completed_sets * completed_reps * current_weight
            
            # Only create logs for completed/in_progress sessions
            if session_info["status"] in ["completed", "in_progress"]:
                exercise_log = ExerciseLog(
                    session_id=session_info["session_obj"].id,
                    exercise_id=exercise.id,
                    completed_sets=completed_sets,
                    completed_reps=completed_reps,
                    completed_weight_kg=current_weight,
                    volume_kg=volume,
                    is_completed=(session_info["status"] == "completed")
                )
                db.add(exercise_log)
                total_logs += 1
    
    db.commit()
    print(f"✅ Generated {total_logs} exercise logs")


def generate_health_metrics(db: Session, trainee: Trainee, start_date: date):
    """Generate bi-weekly health metrics showing transformation."""
    print("📈 Generating health metrics...")
    
    # Starting stats
    height_cm = 178
    base_weight = 82.0
    base_bf = 18.0
    
    metrics_count = 0
    
    # Generate 26 measurements (bi-weekly for 1 year)
    for week in range(0, 53, 2):
        measurement_date = start_date + timedelta(weeks=week)
        
        # Progressive transformation
        if week <= 12:  # Months 1-3: Newbie gains
            weight = base_weight + (week * 0.15)
            bf_percent = base_bf - (week * 0.04)
        elif week <= 24:  # Months 4-6: Slower progress + mini-cut
            if week == 24:  # Mini-cut complete
                weight = base_weight + 3.5
                bf_percent = 15.0
            else:
                weight = base_weight + 4.8 + ((week - 12) * 0.05)
                bf_percent = 17.0 - ((week - 12) * 0.15)
        elif week <= 36:  # Months 7-9: Steady gains
            weight = 86.0 + ((week - 24) * 0.08)
            bf_percent = 15.0 - ((week - 24) * 0.03)
        else:  # Months 10-12: Maintenance/peaking
            weight = 87.5 + ((week - 36) * 0.03)
            bf_percent = 14.3 - ((week - 36) * 0.02)
        
        # Add natural fluctuation
        weight += random.uniform(-0.3, 0.3)
        bf_percent += random.uniform(-0.2, 0.2)
        
        # Ensure realistic bounds
        weight = max(80, min(90, weight))
        bf_percent = max(13, min(19, bf_percent))
        
        metric = HealthMetric(
            trainee_id=trainee.id,
            height_cm=height_cm,
            weight_kg=round(weight, 1),
            body_fat_percentage=round(bf_percent, 1),
            recorded_at=datetime.combine(measurement_date, datetime.min.time())
        )
        db.add(metric)
        metrics_count += 1
    
    db.commit()
    print(f"✅ Generated {metrics_count} health metrics")


def main():
    """Main seeding function."""
    print("\n" + "="*60)
    print("🚀 INVESTOR DEMO DATA SEEDING")
    print("="*60 + "\n")
    
    # Create tables
    Base.metadata.create_all(bind=engine)
    
    db = SessionLocal()
    try:
        # Clear existing demo data
        clear_demo_data(db)
        
        # Create data
        exercise_map = create_exercises(db)
        trainer_entity, trainer_user = create_trainer(db)
        program = create_program(db, trainer_entity, exercise_map)
        trainee = create_trainee(db, trainer_entity, program)
        
        # Generate 1 year of data
        start_date = date(2024, 11, 7)  # Started 1 year ago
        schedule = generate_workout_schedule(start_date)
        
        # Create workout sessions
        print("🏋️ Creating workout sessions...")
        for session_info in schedule:
            session = WorkoutSession(
                trainee_id=trainee.id,
                program_id=program.id,
                session_date=session_info["date"],
                status=session_info["status"]
            )
            db.add(session)
            db.flush()
            session_info["session_obj"] = session
        db.commit()
        print(f"✅ Created {len(schedule)} workout sessions")
        
        # Generate exercise logs
        generate_exercise_logs(db, schedule, program, exercise_map)
        
        # Generate health metrics
        generate_health_metrics(db, trainee, start_date)
        
        # Print summary
        print("\n" + "="*60)
        print("✅ SEEDING COMPLETE!")
        print("="*60)
        print(f"\n📊 Summary Statistics:")
        print(f"   Trainer: Rohit Wagh ({TRAINER_EMAIL})")
        print(f"   Trainee: Vihaan Kulkarni ({TRAINEE_EMAIL})")
        print(f"   Program: 12-Month Strength & Hypertrophy")
        print(f"   Exercises in library: {len(exercise_map)}")
        print(f"   Workout sessions: {len(schedule)}")
        print(f"   Time period: {schedule[0]['date']} to {schedule[-1]['date']}")
        print(f"   Adherence rate: ~85%")
        
        print(f"\n🔐 Login Credentials:")
        print(f"   Trainer - Email: {TRAINER_EMAIL} | Password: {TRAINER_PASSWORD}")
        print(f"   Trainee - Email: {TRAINEE_EMAIL} | Password: {TRAINEE_PASSWORD}")
        
        print("\n💡 Next Steps:")
        print("   1. Start backend: cd backend && uvicorn app.main:app --reload")
        print("   2. Start frontend: cd frontend && npm start")
        print("   3. Login as trainee to see analytics")
        print("   4. Login as trainer to see client dashboard")
        print("="*60 + "\n")
        
    except Exception as e:
        print(f"\n❌ Error during seeding: {e}")
        db.rollback()
        raise
    finally:
        db.close()


if __name__ == "__main__":
    main()
