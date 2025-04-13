from app.db import Base
from sqlalchemy import Column, Integer, String, Boolean, DateTime,Text

class User(Base):
    __tablename__ = "users"

    user_id = Column(Integer, primary_key=True, index=True)
    username = Column(String(50), unique=True, index=True, nullable=False)
    password = Column(Text, nullable=False)
    national_id = Column(String(20), unique=True, nullable=False)