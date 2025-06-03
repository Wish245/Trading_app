from pydantic import BaseModel,PositiveInt,condecimal, ConfigDict
from datetime import datetime

# class StockInStall(BaseModel):
#     stall_id: int

class StockOut(BaseModel):
    stock_id: int
    stall_id: PositiveInt
    item_name: str
    price: condecimal(max_digits=10, decimal_places=2)
    quantity: PositiveInt
    created_date: datetime

    model_config = ConfigDict(from_attributes=True)