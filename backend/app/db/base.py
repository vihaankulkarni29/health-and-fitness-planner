# Import all the models, so that Base has them before being
# imported by Alembic
from app.db.base_class import Base
from app.models.user import User
from app.models.gym import Gym
from app.models.trainer import Trainer
from app.models.trainee import Trainee
from app.models.program import Program
from app.models.exercise import Exercise
from app.models.health_metric import HealthMetric
from app.models.program_exercise import ProgramExercise
from app.models.workout_session import WorkoutSession
from app.models.exercise_log import ExerciseLog
