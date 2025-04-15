from sqlalchemy import Column, Integer, String, ForeignKey
from app.db.base import Base

class Stall(Base):
    __tablename__ = "stall"
    stall_id = Column(Integer, primary_key=True)
    stall_name = Column(String(100), nullable=False)
    user_id = Column(Integer, ForeignKey("users.user_id", ondelete="CASCADE"), nullable=False)
