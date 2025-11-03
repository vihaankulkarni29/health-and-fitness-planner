from sqlalchemy import Column, Integer, String, DateTime, func, ForeignKey
from sqlalchemy.orm import relationship
from app.db.base_class import Base

class Trainer(Base):
    id = Column(Integer, primary_key=True, index=True)
    first_name = Column(String(100), nullable=False)
    last_name = Column(String(100), nullable=False)
    email = Column(String(100), unique=True, index=True, nullable=False)
    gym_id = Column(Integer, ForeignKey("gyms.id"))
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    gym = relationship("Gym", back_populates="trainers")
