from sqlalchemy import Column, Integer, String, DateTime, func, ForeignKey, Enum
from sqlalchemy.orm import relationship, Mapped, mapped_column
from app.db.base_class import Base
import enum

class UserRole(str, enum.Enum):
    ADMIN = "admin"
    TRAINER = "trainer"
    TRAINEE = "trainee"

class Trainee(Base):
    __tablename__ = 'trainees'

    id = Column(Integer, primary_key=True, index=True)
    first_name = Column(String(100), nullable=False)
    last_name = Column(String(100), nullable=False)
    email = Column(String(100), unique=True, index=True, nullable=False)
    hashed_password = Column(String(255), nullable=False)
    gym_id = Column(Integer, ForeignKey("gyms.id"))
    trainer_id = Column(Integer, ForeignKey("trainers.id"))
    program_id = Column(Integer, ForeignKey("programs.id"))
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    role: Mapped[UserRole] = mapped_column(Enum(UserRole), default=UserRole.TRAINEE, nullable=False)

    gym = relationship("Gym", back_populates="trainees")
    trainer = relationship("Trainer", back_populates="trainees")
    program = relationship("Program", back_populates="trainees")
    health_metrics = relationship("HealthMetric", back_populates="trainee")
    workout_sessions = relationship("WorkoutSession", back_populates="trainee")
