from sqlalchemy import Column, Integer, Float, DateTime, func, ForeignKey
from sqlalchemy.orm import relationship
from app.db.base_class import Base

class HealthMetric(Base):
    __tablename__ = 'health_metrics'

    id = Column(Integer, primary_key=True, index=True)
    trainee_id = Column(Integer, ForeignKey("trainees.id"), index=True)
    recorded_at = Column(DateTime(timezone=True), server_default=func.now(), index=True)

    # Tier 1: Core Composition (The Basics)
    weight_kg = Column(Float, nullable=True)
    height_cm = Column(Float, nullable=True)
    body_fat_percentage = Column(Float, nullable=True) # PBF
    skeletal_muscle_mass_kg = Column(Float, nullable=True) # SMM
    body_fat_mass_kg = Column(Float, nullable=True)
    bmi = Column(Float, nullable=True)

    # Tier 2: Structural & Metabolic (The "Deep Dive")
    total_body_water_l = Column(Float, nullable=True)
    protein_kg = Column(Float, nullable=True)
    minerals_kg = Column(Float, nullable=True)
    basal_metabolic_rate_kcal = Column(Float, nullable=True) # BMR
    visceral_fat_level = Column(Integer, nullable=True)
    inbody_score = Column(Float, nullable=True)

    # Tier 3: Segmental Lean Analysis (Muscle Balance)
    left_arm_lean_kg = Column(Float, nullable=True)
    right_arm_lean_kg = Column(Float, nullable=True)
    left_leg_lean_kg = Column(Float, nullable=True)
    right_leg_lean_kg = Column(Float, nullable=True)
    trunk_lean_kg = Column(Float, nullable=True)

    trainee = relationship("Trainee", back_populates="health_metrics")
