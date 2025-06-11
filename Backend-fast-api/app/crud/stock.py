from app.schemas.stock import StockOut
from sqlalchemy.orm import Session
from app.models.stock import Stock as stock_model
from typing import List,Optional
import app.logger

logger = app.logger.get_logger(__name__)

def get_my_stock(db: Session, stall_id: str) -> Optional[List[StockOut]]:
    try:
        stocks = db.query(stock_model).filter(stock_model.stall_id == stall_id).all()
        if not stocks:
            return None
        
        return [StockOut.from_orm(s) for s in stocks]
    
    except Exception as e:
        logger.error(f"failed to fetch stocks with stall_id: {stall_id}")
        raise e
    
def get_all_stock(db: Session) -> List[StockOut]:
    try:
        stocks = db.query(stock_model).all()

        return [StockOut.from_orm(s) for s in stocks]
    except Exception as e:
        logger.error(f"failed to fetch stocks")
        raise e
    
def create_stock(db: Session, stall_id: int, )