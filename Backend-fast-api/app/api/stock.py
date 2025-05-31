from fastapi import APIRouter, Depends, HTTPException, status, Response
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.crud import stock as stock_crud
from app.schemas.stock import StockOut, StockInStall
from typing import List, Optional

router = APIRouter()

@router.get("/me", response_model=Optional[List[StockOut]])
def my_stock(payload: StockInStall, db: Session = Depends(get_db)):
    try:
        stocks = stock_crud.get_my_stock(db, payload.stall_id)
        return stocks
    except Exception:
        raise HTTPException(statuc_code = 404, details="stocks not found")

@router.get("/all", response_model=List[StockOut])
def all_stock(db: Session = Depends(get_db)):
    try:
        stocks = stock_crud.get_all_stock(db)
        return stocks
    except Exception:
        raise HTTPException(status_code=404, details="stocks not found")