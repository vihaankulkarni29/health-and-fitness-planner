from sqlalchemy import Column, Integer, String, DateTime, func
from app.db.base_class import Base

class Gym(Base):
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    address = Column(String(255), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
