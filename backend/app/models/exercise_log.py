from sqlalchemy import Column, Integer, Float, Boolean, DateTime, func, ForeignKey
from sqlalchemy.orm import relationship
from app.db.base_class import Base

class ExerciseLog(Base):
    __tablename__ = 'exercise_logs'

    id = Column(Integer, primary_key=True, index=True)
    session_id = Column(Integer, ForeignKey("workout_sessions.id"), index=True)
    exercise_id = Column(Integer, ForeignKey("exercises.id"), index=True)
    completed_sets = Column(Integer)
    completed_reps = Column(Integer)
    completed_weight_kg = Column(Float)
    completed_duration_minutes = Column(Integer, nullable=True)
    volume_kg = Column(Float)
    is_completed = Column(Boolean, default=True)
    logged_at = Column(DateTime(timezone=True), server_default=func.now())

    session = relationship("WorkoutSession", back_populates="exercise_logs")
    exercise = relationship("Exercise", back_populates="exercise_logs")
