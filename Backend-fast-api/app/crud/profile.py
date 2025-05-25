from sqlalchemy.orm import Session
from app.models import User as user_model, Contact as contact_model
import app.schemas
from app.schemas.profile import GetProfile,UpdateEmail,UpdatePhone,UpdateUsername
import app.logger
import app.schemas.profile

logger = app.logger.get_logger(__name__)

def get_user_profile(db: Session, user_id: int) -> GetProfile:
    try:

        user = db.query(user_model).filter(user_model.user_id == user_id).first()
        if not user:
            return None

        else: 
            return GetProfile (
                username = user.username,
                national_id = user.national_id,
                email = user.email,
                phone = user.phone
                )
    except Exception as e:
        logger.error(f"failed to fetch user data")
        raise e
    

def edit_username(db: Session, user_id: int, new_username: str) -> UpdateUsername:
    try:

        user = db.query(user_model).filter(user_model.user_id == user_id).first()
        if not user:
            return None
        
        existing = db.query(user_model).filter(user_model.username == new_username).first()
        
        if existing and existing.id != user_id:
            raise ValueError("Username already taken")
        
        user.username = new_username
        db.commit()
        db.refresh(user)
        logger.info(f"new useraname: '{user.username}'")
        return user
    
    except Exception as e:
        db.rollback()
        logger.error(f"Failed to change the username")
        raise e
    
def edit_email(db: Session, user_id: int, new_email: str) -> UpdateEmail:
    try:

        user = db.query(user_model).filter(user_model.user_id == user_id).first()
        if not user:
            return None
        existing = db.query(user_model).filter(user_model.email == new_email).first()

        if existing and existing.id != user_id:
            raise ValueError("Email is already linked to other user")
        
        user.email = new_email
        db.commit()
        db.refresh(user)
        logger.info(f"Email updated {user.email}")
        return user
    
    except Exception as e:
        db.rollback()
        logger.error(f"Failed to change the email")
        raise e
    

def edit_phone(db: Session, user_id: int, new_phone: str) -> UpdatePhone:
    try:

        user = db.query(user_model).filter(user_model.user_id == user_id).first()
        if not user:
            return None
        
        existing = db.query(user_model).filter(user_model.phone == new_phone).first()

        if existing and existing.id != user_id:
            raise ValueError("Phone number is already linked to other user")
        
        user.phone = new_phone
        db.commit()
        db.refresh(user)
        logger.info(f"Phone updated {user.phone}")
        return user
    
    except Exception as e:
        db.rollback()
        logger.error(f"Failed to change the phone")
        raise e