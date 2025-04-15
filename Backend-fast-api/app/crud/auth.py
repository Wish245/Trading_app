from sqlalchemy.orm import Session
from app.models import User as user_model
from app.core.security import verify_password


def authenticate_user(db: Session, username: str, password: str):
    user = db.query(user_model).filter(user_model.username == username).first()
    if not user:
        return None
    if not verify_password(password, user.password):
        return None
    return user