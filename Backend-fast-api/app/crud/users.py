from sqlalchemy.orm import Session
from app.models import User as user_model, Contact as contact_model
import app.schemas
from app.schemas.users import UserOut
from app.core.security import hash_password
import app.logger
import app.schemas.users

logger = app.logger.get_logger(__name__)

def create_user(db: Session, user_data: app.schemas.users.UserCreate) -> UserOut:
    try:
        with db.begin():
            hashed_password = hash_password(user_data.password)

            db_user = user_model(
                username = user_data.username,
                national_id = user_data.national_id,
                password = hashed_password,
                email = user_data.email,
                phone = user_data.phone,
            )
            db.add(db_user)
            db.flush()

            email_contact = contact_model(
                contact_type = "email",
                contact_value = user_data.email,
                is_primary = True
            )

            phone_contact = contact_model(
                contact_type = "phone",
                contact_value = user_data.phone,
                is_primary = True
            )

            db.add_all([email_contact,phone_contact])

            db.refresh(db_user)
            logger.info(f"User '{db_user.username}' created with ID {db_user.user_id}")
            return UserOut.from_orm(db_user)
    except Exception as e:
        db.rollback()
        logger.error(f"Failed to create user '{user_data.username}': {str(e)}")
        raise e 
    

def get_user_by_username(db: Session, username: str):
    return db.query(user_model.User).filter(user_model.User.username == username).first()