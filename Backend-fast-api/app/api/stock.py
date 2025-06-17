from fastapi import APIRouter, Depends, HTTPException, Form, UploadFile, File
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.crud import stock as stock_crud
from app.schemas.stock import StockOut, StockCreate
from typing import List, Optional
from decimal import Decimal
import os
from uuid import uuid4

router = APIRouter()

upload_dir = os.path.join("assets", "stock-img")
os.makedirs(upload_dir, exist_ok=True)


@router.get("/me", response_model=Optional[List[StockOut]])
def my_stock(stall_id: int, db: Session = Depends(get_db)):
    stocks = stock_crud.get_my_stock(db, stall_id)
    if not stocks:
        raise HTTPException(status_code=404, detail="No stock found for this stall")
    return [StockOut.from_orm(s) for s in stocks]


@router.get("/all", response_model=List[StockOut])
def all_stock(db: Session = Depends(get_db)):
    stocks = stock_crud.get_all_stock(db)
    if not stocks:
        raise HTTPException(status_code=404, detail="No stock found")
    return [StockOut.from_orm(s) for s in stocks]


@router.post("/create", response_model=StockOut)
async def stock_create(
    db: Session = Depends(get_db),
    stall_id: int = Form(...),
    item_name: str = Form(...),
    price: Decimal = Form(...),
    quantity: int = Form(...),
    image: Optional[UploadFile] = File(None)
):
    try:
        stock_data = StockCreate(
            stall_id=stall_id,
            item_name=item_name,
            price=price,
            quantity=quantity
        )
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Validation error: {e}")

    image_path = None
    if image:
        try:
            unique_id = uuid4().hex
            ext = os.path.splitext(image.filename)[1] or ".png"
            safe_item_name = item_name.replace(" ", "_")
            filename = f"stock_{stall_id}_{safe_item_name}_{unique_id}{ext}"
            image_path = os.path.join("stock-img", filename)

            file_path = os.path.join("assets", image_path)
            with open(file_path, "wb") as f:
                f.write(await image.read())
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Image upload failed: {e}")

    try:
        db_stock = stock_crud.create_stock(db, stock_data, image_path)
        return db_stock
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Creating the stock failed: {e}")
    

@router.get("/{stock_id}", response_model=StockOut)
def get_stock_by_id(stock_id: int, db: Session = Depends(get_db)):
    stock = stock_crud.get_stock_by_id(db, stock_id)
    if not stock:
        raise HTTPException(status_code=404, detail="Stock not found")
    return stock

