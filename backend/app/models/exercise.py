from sqlalchemy import Column, Integer, String, Text
from sqlalchemy.orm import relationship
from app.db.base_class import Base

class Exercise(Base):
    __tablename__ = 'exercises'

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), unique=True, index=True, nullable=False)
    description = Column(Text, nullable=True)
    video_url = Column(String(255), nullable=True)

    programs = relationship("ProgramExercise", back_populates="exercise")
    exercise_logs = relationship("ExerciseLog", back_populates="exercise")
