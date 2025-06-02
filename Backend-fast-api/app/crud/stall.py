import app.schemas.stall
from sqlalchemy.orm import Session
from app.models import Stall as stall_model
# from app.models import User as user_model
import app.schemas
from app.schemas.stall import StallOut
import app.logger
from typing import List,Optional

logger = app.logger.get_logger(__name__)

def create_stall(db: Session, user_id: int, stall_name: str) -> StallOut:
    try:
        db_stall = stall_model (
            user_id = user_id,
            stall_name = stall_name,
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

def get_my_stall(db:Session, user_id: int) -> Optional[List[StallOut]]:
    try:

        stall = db.query(stall_model).filter(stall_model.user_id == user_id).all()
        if not stall:
            return None
        
        return [StallOut.from_orm(s) for s in stall]
    
    except Exception as e:
        logger.error(f"failed to fetch users stalls with user_id: {user_id}")
        raise e
    
def get_all_stall(db: Session) -> List[StallOut]:
    try:

        stall = db.query(stall_model).all()

        return [StallOut.from_orm(s) for s in stall]
    

    except Exception as e:
        logger.error(f"failed to fetch all stalls")
        raise e


def get_stall_by_stall_name(db: Session, stall_name: str):
        return db.query(stall_model).filter(stall_model.stall_name == stall_name).first()