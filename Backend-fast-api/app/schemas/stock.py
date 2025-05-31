from pydantic import BaseModel,PositiveInt,condecimal
from datetime import datetime

class StockOut(BaseModel):
    stock_id: int
    stall_id: PositiveInt
    item_id: PositiveInt
    price: condecimal(max_digits=10, decimal_places=2)
    quantity: PositiveInt
    created_date: datetime

    class config:
        orm_mode = True