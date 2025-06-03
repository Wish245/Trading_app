from fastapi import APIRouter, Depends, HTTPException, status, Response
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.crud import stock as stock_crud
from app.schemas.stock import StockOut
from typing import List, Optional

router = APIRouter()

@router.get("/me", response_model=Optional[List[StockOut]])
def my_stock(stall_id: int, db: Session = Depends(get_db)):
        stocks = stock_crud.get_my_stock(db,stall_id)
        if not stocks:
            raise HTTPException(status_code=404, detail="No stock found for this stall")

        return [StockOut.from_orm(s) for s in stocks]


@router.get("/all", response_model=List[StockOut])
def all_stock(db: Session = Depends(get_db)):
        stocks = stock_crud.get_all_stock(db)
        if not stocks:
            raise HTTPException(status_code=404, detail="No stock found for this stall")

        return [StockOut.from_orm(s) for s in stocks]