from sqlalchemy import Column, Integer, ForeignKey, Numeric, TIMESTAMP, String
from sqlalchemy.sql import func
from app.db.base import Base

class Order(Base):
    __tablename__ = "orders"
    order_id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey("users.user_id", ondelete="CASCADE"), nullable=False)
    order_date = Column(TIMESTAMP, server_default=func.now())
    order_status_id = Column(Integer, ForeignKey("order_statuses.order_status_id", ondelete="CASCADE"), nullable=False)
class OrderItem(Base):
    __tablename__ = "order_items"
    order_item_id = Column(Integer, primary_key=True)
    order_id = Column(Integer, ForeignKey("orders.order_id", ondelete="CASCADE"), nullable=False)
    stock_id = Column(Integer, ForeignKey("stock.stock_id", ondelete="CASCADE"), nullable=False)
    quantity = Column(Integer, nullable=False)
    price_at_order = Column(Numeric(10, 2), nullable=False)

class OrderStatuses (Base):
    __tablename__ = "order_statuses"
    order_status_id = Column(Integer, primary_key=True)
    status_name = Column(String(50), nullable=False, unique=True)