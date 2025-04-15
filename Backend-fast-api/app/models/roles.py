from app.db import Base
from sqlalchemy import Column, Integer, String, Boolean, DateTime, ForeignKey

class Roles(Base):
    __tablename__ = "roles"

    role_id = Column(Integer, primary_key=True, index=True)
    role_name = Column(String(50), unique=True, index=True)

class UserRoles(Base):
    __tablename__ = "user_roles"

    user_id = Column(Integer, ForeignKey("users.user_id"), ondelete = "CASCADE", primary_key=True)
    role_id = Column(Integer, ForeignKey("roles.role_id"), ondelete = "CASCADE", primary_key=True)