from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from app.core.config import settings
from app.db.base import Base

engine = create_engine(
    settings.SQLALCHEMY_DATABASE_URI,
    echo=True  # Show SQL queries in logs (disable in prod)
)

# Create a configured "Session" class
SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine
)

# Dependency to get a DB session in routes
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()