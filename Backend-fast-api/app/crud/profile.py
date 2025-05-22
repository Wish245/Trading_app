from sqlalchemy.orm import Session
from app.models import User as user_model, Contact as contact_model
import app.schemas
from app.schemas.profile import GetProfile,UpdateEmail,UpdatePhone,UpdateUsername
import app.logger
import app.schemas.profile

logger = app.logger.get_logger(__name__)

def get_user_profile(db: Session, username: int) -> GetProfile:
    try:

        user = db.query(user_model).filter(user_model.user_id == user_id).first()
        if not user:
            return None
        
        email = phone = None

        for contact in user.contacts:
            if contact.contact_type == "email" and not email:
                email = contact.contact_value
            if contact.contact_type == "phone" and not phone:
                phone = contact.contact_value
        
        return GetProfile (
            username = user.username,
            national_id = user.national_id,
            email = email or "",
            phone = phone or ""
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
        
        for contact in user.contact:
            if contact.contact_type == "email":
                db.delete(contact)
                break

        email_contact = contact_model(
            contact_type = "email",
            contact_value = new_email,
            is_primary = True
        )

        db.add(email_contact)
        db.refresh(user)
        logger.info(f"email upadated ")
        return user
    
    except Exception as e:
        db.rollback()
        logger.error(f"Failed to change the email")
        raise e
    

def edit_phone(db: Session, user_id: int, new_phone: str) -> UpdateEmail:
    try:

        user = db.query(user_model).filter(user_model.user_id == user_id).first()
        if not user:
            return None
        
        for contact in user.contact:
            if contact.contact_type == "phone":
                db.delete(contact)
                break

        phone_contact = contact_model(
            contact_type = "phone",
            contact_value = new_phone,
            is_primary = True
        )

        db.add(phone_contact)
        db.refresh(user)
        logger.info(f"phone upadated ")
        return user
    
    except Exception as e:
        db.rollback()
        logger.error(f"Failed to change the phone")
        raise e