from sqlalchemy import Column, Integer, String, Date, ForeignKey
from sqlalchemy.orm import relationship
from app.db.base_class import Base

class WorkoutSession(Base):
    __tablename__ = 'workout_sessions'

    id = Column(Integer, primary_key=True, index=True)
    trainee_id = Column(Integer, ForeignKey("trainees.id"), index=True)
    program_id = Column(Integer, ForeignKey("programs.id"), index=True)
    session_date = Column(Date, nullable=False, index=True)
    status = Column(String, nullable=False)

    trainee = relationship("Trainee", back_populates="workout_sessions")
    program = relationship("Program", back_populates="workout_sessions")
    exercise_logs = relationship("ExerciseLog", back_populates="session")
