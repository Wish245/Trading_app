from sqlalchemy.orm import Session
from app.models import User as user_model, Contact as contact_model
from app.schemas.users import UserOut
from app.core.security import hash_password
import app.logger

logger = app.logger.get_logger(__name__)

