from sqlalchemy import Column, Integer, Float, DateTime, func, ForeignKey
from sqlalchemy.orm import relationship
from app.db.base_class import Base

class HealthMetric(Base):
    __tablename__ = 'health_metrics'

    id = Column(Integer, primary_key=True, index=True)
    trainee_id = Column(Integer, ForeignKey("trainees.id"))
    height_cm = Column(Float, nullable=True)
    weight_kg = Column(Float, nullable=True)
    body_fat_percentage = Column(Float, nullable=True)
    recorded_at = Column(DateTime(timezone=True), server_default=func.now())

    trainee = relationship("Trainee", back_populates="health_metrics")
