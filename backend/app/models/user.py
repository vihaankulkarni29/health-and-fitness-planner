from sqlalchemy import Column, Integer, String, DateTime, func, Enum, Boolean
from sqlalchemy.orm import relationship, Mapped, mapped_column
from app.db.base_class import Base
import enum

class UserRole(str, enum.Enum):
    ADMIN = "admin"
    TRAINER = "trainer"
    TRAINEE = "trainee"

class User(Base):
    __tablename__ = 'users'

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(100), unique=True, index=True, nullable=False)
    hashed_password = Column(String(255), nullable=False)
    role: Mapped[UserRole] = mapped_column(Enum(UserRole), default=UserRole.TRAINEE, nullable=False)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # Relationships
    trainee_profile = relationship("Trainee", back_populates="user", uselist=False)
    trainer_profile = relationship("Trainer", back_populates="user", uselist=False)
