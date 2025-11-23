from sqlalchemy import Column, Integer, String, DateTime, func, ForeignKey
from sqlalchemy.orm import relationship
from app.db.base_class import Base

class Trainee(Base):
    __tablename__ = 'trainees'

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), unique=True, nullable=False)
    
    first_name = Column(String(100), nullable=False)
    last_name = Column(String(100), nullable=False)
    
    gym_id = Column(Integer, ForeignKey("gyms.id"))
    trainer_id = Column(Integer, ForeignKey("trainers.id"))
    program_id = Column(Integer, ForeignKey("programs.id"))
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    user = relationship("User", back_populates="trainee_profile")
    gym = relationship("Gym", back_populates="trainees")
    trainer = relationship("Trainer", back_populates="trainees")
    program = relationship("Program", back_populates="trainees")
    health_metrics = relationship("HealthMetric", back_populates="trainee")
    workout_sessions = relationship("WorkoutSession", back_populates="trainee")

    @property
    def email(self):
        return self.user.email if self.user else None
