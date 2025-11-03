from sqlalchemy import Column, Integer, Float, ForeignKey
from sqlalchemy.orm import relationship
from app.db.base_class import Base

class ProgramExercise(Base):
    __tablename__ = 'program_exercises'

    id = Column(Integer, primary_key=True, index=True)
    program_id = Column(Integer, ForeignKey("programs.id"))
    exercise_id = Column(Integer, ForeignKey("exercises.id"))
    order = Column(Integer, nullable=False)
    prescribed_sets = Column(Integer)
    prescribed_reps = Column(Integer)
    prescribed_weight_kg = Column(Float)

    program = relationship("Program", back_populates="exercises")
    exercise = relationship("Exercise", back_populates="programs")
