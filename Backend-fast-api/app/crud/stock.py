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
    
def create_stock(db: Session, stock_data: str, image_path:str):
    try:
        db_stock = stock_model(stall_id=stock_data.stall_id, 
                               item_name=stock_data.item_name,
                               price=stock_data.price,
                               quantity=stock_data.quantity,
                               stock_img_path=image_path
                               )
        db.add(db_stock)
        db.commit()
        db.refresh(db_stock)
        return db_stock
    
    except Exception as e:
        db.rollback()
        logger.error(f"Failed to create the stock")
        raise e


def get_stock_by_id(db: Session, stock_id: int) -> Optional[StockOut]:
    try:
        stock = db.query(stock_model).filter(stock_model.stock_id == stock_id).first()
        if not stock:
            return None
        return StockOut.from_orm(stock)
    except Exception as e:
        logger.error(f"Failed to fetch stock with id: {stock_id}")
        raise e
