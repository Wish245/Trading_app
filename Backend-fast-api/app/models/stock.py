from sqlalchemy import Column, Integer, ForeignKey, Numeric, Text, TIMESTAMP, String
from sqlalchemy.sql import func
from app.db.base import Base

class Stock(Base):
    __tablename__ = "stock"
    stock_id = Column(Integer, primary_key=True)
    stall_id = Column(Integer, ForeignKey("stall.stall_id", ondelete="CASCADE"), nullable=False)
    item_name = Column(String(100), nullable=False)
    price = Column(Numeric(10, 2), nullable=False)
    quantity = Column(Integer, nullable=False)
    stock_img_path = Column(String(500))
    created_date = Column(TIMESTAMP, server_default=func.now())

# class StockImage(Base):
#     __tablename__ = "stock_images"
#     image_id = Column(Integer, primary_key=True)
#     stock_id = Column(Integer, ForeignKey("stock.stock_id", ondelete="CASCADE"), nullable=False)
#     image_path = Column(Text, nullable=False)
#     uploaded_at = Column(TIMESTAMP, server_default=func.now())