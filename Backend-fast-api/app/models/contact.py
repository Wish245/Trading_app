from app.db import Base
from sqlalchemy import Column, Integer, String, Text, Boolean, DateTime, ForeignKey
from sqlalchemy.orm import relationship

class Contact(Base):
    __tablename__ = "user_contacts"

    contact_id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.user_id", ondelete="CASCADE"), nullable=False)
    contact_type = Column(String(50), nullable=False)  # e.g., "email", "phone"
    contact_value = Column(Text, nullable=False)
    is_primary = Column(Boolean, default=False)

    user = relationship ("User" , back_populates = "contacts")