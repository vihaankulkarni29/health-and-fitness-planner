from sqlalchemy import Column, Integer, String, DateTime, func, ForeignKey, Text
from sqlalchemy.orm import relationship
from app.db.base_class import Base

class Program(Base):
    __tablename__ = 'programs'

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    description = Column(Text, nullable=True)
    trainer_id = Column(Integer, ForeignKey("trainers.id"))
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    trainer = relationship("Trainer", back_populates="programs")
    trainees = relationship("Trainee", back_populates="program")
    exercises = relationship("ProgramExercise", back_populates="program")
    workout_sessions = relationship("WorkoutSession", back_populates="program")
