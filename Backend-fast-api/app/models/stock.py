from sqlalchemy import Column, Integer, ForeignKey, Numeric, Text, TIMESTAMP
from sqlalchemy.sql import func
from app.db.base import Base

class Stock(Base):
    __tablename__ = "stock"
    stock_id = Column(Integer, primary_key=True)
    stall_id = Column(Integer, ForeignKey("stall.stall_id", ondelete="CASCADE"), nullable=False)
    flower_id = Column(Integer, ForeignKey("flowers.flower_id", ondelete="CASCADE"), nullable=False)
    price = Column(Numeric(10, 2), nullable=False)
    quantity = Column(Integer, nullable=False)
    created_date = Column(TIMESTAMP, server_default=func.now())

class StockImage(Base):
    __tablename__ = "stock_images"
    image_id = Column(Integer, primary_key=True)
    stock_id = Column(Integer, ForeignKey("stock.stock_id", ondelete="CASCADE"), nullable=False)
    image_path = Column(Text, nullable=False)
    uploaded_at = Column(TIMESTAMP, server_default=func.now())
