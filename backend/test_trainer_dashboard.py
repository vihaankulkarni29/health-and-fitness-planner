from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from app.core.config import settings
from app.auth import crud
from app.schemas.program import ProgramCreate
from app.schemas.program_exercise import ProgramExerciseCreate
from app.models.user import User
from app.models.program import Program
from app.models.program_exercise import ProgramExercise
from app.models.trainee import Trainee
from app.db.base import Base

# Setup DB connection
engine = create_engine(settings.SQLALCHEMY_DATABASE_URI)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
db = SessionLocal()

def test_create_and_assign_program():
    print("Testing Trainer Dashboard Features...")
    
    # 1. Setup Dummy Trainer & Trainee (assuming they exist or creating them)
    # For simplicity, we'll just pick the first available trainer and trainee
    # In a real test, we'd create them fresh.
    
    # Let's assume we have a trainer with ID 1 (or create one)
    trainer_id = 1 
    # Let's assume we have a trainee with ID 1
    trainee_id = 1
    
    # 2. Create Program with Exercises
    print("Creating Program with Exercises...")
    exercises = [
        ProgramExerciseCreate(
            program_id=1, # Dummy ID to satisfy Pydantic validation (will be overwritten)
            exercise_id=1, # Assuming exercise 1 exists
            order=1,
            prescribed_sets=3,
            prescribed_reps=10,
            prescribed_weight_kg=50
        )
    ]
    
    # Simulate API Logic for Creation
    program_in = ProgramCreate(
        name="Test Dashboard Program",
        description="Created via test script",
        trainer_id=trainer_id,
        exercises=exercises
    )
    
    # Create Program
    db_program = Program(
        name=program_in.name,
        description=program_in.description,
        trainer_id=program_in.trainer_id
    )
    db.add(db_program)
    db.commit()
    db.refresh(db_program)
    print(f"Program Created: ID={db_program.id}")
    
    # Create Exercises
    for ex_data in program_in.exercises:
        db_ex = ProgramExercise(
            program_id=db_program.id,
            exercise_id=ex_data.exercise_id,
            order=ex_data.order,
            prescribed_sets=ex_data.prescribed_sets,
            prescribed_reps=ex_data.prescribed_reps,
            prescribed_weight_kg=ex_data.prescribed_weight_kg
        )
        db.add(db_ex)
    db.commit()
    print("Program Exercises Created.")
    
    # 3. Assign Program
    print(f"Assigning Program {db_program.id} to Trainee {trainee_id}...")
    trainee = db.query(Trainee).filter(Trainee.id == trainee_id).first()
    if trainee:
        trainee.program_id = db_program.id
        db.commit()
        print("✅ Assignment Successful!")
    else:
        print("❌ Trainee not found (skipping assignment check)")

    # Cleanup
    # db.delete(db_program)
    # db.commit()

if __name__ == "__main__":
    try:
        test_create_and_assign_program()
    except Exception as e:
        print(f"❌ Test Failed: {e}")
    finally:
        db.close()
