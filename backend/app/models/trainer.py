from sqlalchemy import Column, Integer, String, DateTime, func, ForeignKey
from sqlalchemy.orm import relationship
from app.db.base_class import Base

class Trainer(Base):
    __tablename__ = 'trainers'

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), unique=True, nullable=False)
    
    @property
    def email(self):
        return self.user.email if self.user else None

    @email.setter
    def email(self, value):
        if self.user:
            self.user.email = value
    
    first_name = Column(String(100), nullable=False)
    last_name = Column(String(100), nullable=False)
    
    gym_id = Column(Integer, ForeignKey("gyms.id"))
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    user = relationship("User", back_populates="trainer_profile")
    gym = relationship("Gym", back_populates="trainers")
    programs = relationship("Program", back_populates="trainer")
    trainees = relationship("Trainee", back_populates="trainer")
