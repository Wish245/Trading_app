from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy import Column, Integer, String, DateTime
# print(sqlalchemy.__version__)
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import sessionmaker, declarative_base
from config import DATABASE_URL
from datetime import datetime

# Async Engine setup
engine = create_async_engine(DATABASE_URL, echo=True, future=True)

# AsyncSession
AsyncSessionLocal = sessionmaker(
    bind=engine, expire_on_commit=False, class_=AsyncSession
)

# Base for all models
Base = declarative_base()

# Your table structure should also use the Base
class User(Base):
    __tablename__ = 'users'

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String(50), unique=True, nullable=False)
    email = Column(String(100), nullable=False)
    phone = Column(String(20), nullable=False)
    national_id = Column(String(30), unique=True, nullable=False)
    password = Column(String, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

# Create tables asynchronously
async def create_tables():
    async with engine.begin() as conn:
        # This creates the tables defined in the Base (e.g., User)
        await conn.run_sync(Base.metadata.create_all)

async def get_db() -> AsyncSession:
    async with AsyncSessionLocal() as session:
        yield session