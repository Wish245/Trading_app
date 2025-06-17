from pydantic import BaseModel, PositiveInt, condecimal, ConfigDict, Field
from typing import Optional
from datetime import datetime

class StockOut(BaseModel):
    stock_id: int
    stall_id: PositiveInt
    item_name: str
    price: condecimal(max_digits=10, decimal_places=2)
    quantity: PositiveInt
    image_filename: Optional[str] = Field(None, alias="stock_img_path")
    created_date: datetime

    model_config = ConfigDict(from_attributes=True, populate_by_name=True)

class StockCreate(BaseModel):
    stall_id: PositiveInt
    item_name: str
    price: condecimal(max_digits=10, decimal_places=2)
    quantity: PositiveInt

    model_config = ConfigDict(from_attributes=True)
