import app.schemas.stall
from sqlalchemy.orm import Session
from app.models import Stall as stall_model
import app.schemas
from app.schemas.stall import StallOut
import app.logger

logger = app.logger.get_logger(__name__)

def create_stall(db: Session, stall_data: app.schemas.stall.CreateStall) -> StallOut:
    try:
        db_stall = stall_model (
            user_id = stall_data.user_id,
            stall_name = stall_data.stall_name,
        )
        db.add(db_stall)
        db.commit()
        db.refresh(db_stall)

        logger.info(f"Stall '{db_stall.stall_name}' created with ID {db_stall.stall_id}")
        return StallOut.from_orm(db_stall)
    except Exception as e:
        db.rollback()
        logger.error(f"Failed to create stall '{db_stall.stall_name}': {str(e)}")
        raise e