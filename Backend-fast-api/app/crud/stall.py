import app.schemas.stall
from sqlalchemy.orm import Session
from app.models import Stall as stall_model
# from app.models import User as user_model
import app.schemas
from app.schemas.stall import StallOut
import app.logger
from typing import List,Optional
import os

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

def delete_stall(db: Session, stall_id: int) -> bool:
    try:

        stall = db.query(stall_model).filter(stall_model.stall_id == stall_id).first()

        if not stall:
            logger.warning(f"stall with stall_id '{stall_id}' not found")
        
        db.delete(stall)
        db.commit()
        logger.info(f"stall with stall_id '{stall_id}' was removed successfully")
        return True
    
    except Exception as e:
        db.rollback()
        logger.error(f"Failed to delete the stall with stall_id {stall_id}")

def set_stall_background(db: Session, stall_id: int, filename: str) -> bool:
    """
    Store the given filename (relative path) in stall_bg_img for this stall.
    Returns True if updated, False if the stall wasn't found.
    """
    stall = db.query(stall_model).filter(stall_model.stall_id == stall_id).first()
    if not stall:
        logger.warning(f"set_stall_background: stall {stall_id} not found")
        return False

    stall.stall_bg_img = filename
    try:
        db.add(stall)
        db.commit()
        logger.info(f"set_stall_background: stall {stall_id} updated with {filename}")
        return True
    except Exception as e:
        db.rollback()
        logger.error(f"set_stall_background failed for stall {stall_id}: {e}")
        return False
    

def remove_stall_background(db: Session, stall_id: int) -> bool:
    """
    Clears stall_bg_img for this stall (does not delete file on disk).
    Returns True if stall existed and was updated; False otherwise.
    """
    stall = db.query(stall_model).filter(stall_model.stall_id == stall_id).first()
    if not stall:
        logger.warning(f"remove_stall_background: stall {stall_id} not found")
        return False

    stall.stall_bg_img = None
    try:
        db.add(stall)
        db.commit()
        logger.info(f"remove_stall_background: cleared bg_img for stall {stall_id}")
        return True
    except Exception as e:
        db.rollback()
        logger.error(f"remove_stall_background failed for stall {stall_id}: {e}")
        return False