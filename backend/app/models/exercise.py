from sqlalchemy import Column, Integer, String, Text
from app.db.base_class import Base

class Exercise(Base):
    __tablename__ = 'exercises'

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), unique=True, index=True, nullable=False)
    description = Column(Text, nullable=True)
    video_url = Column(String(255), nullable=True)
