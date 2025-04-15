from sqlalchemy import Column, Integer, ForeignKey, String, Numeric, TIMESTAMP
from sqlalchemy.sql import func
from app.db.base import Base

class PaymentMethod(Base):
    __tablename__ = "payment_methods"
    payment_method_id = Column(Integer, primary_key=True)
    method_name = Column(String(50), nullable=False)

class PaymentStatus(Base):
    __tablename__ = "payment_statuses"
    status_id = Column(Integer, primary_key=True)
    status_name = Column(String(50), unique=True, nullable=False)

class Payment(Base):
    __tablename__ = "payment"
    payment_id = Column(Integer, primary_key=True)
    order_id = Column(Integer, ForeignKey("orders.order_id", ondelete="CASCADE"), nullable=False)
    payment_method_id = Column(Integer, ForeignKey("payment_methods.payment_method_id", ondelete="CASCADE"), nullable=False)
    payment_amount = Column(Numeric(10, 2), nullable=False)
    payment_time = Column(TIMESTAMP, server_default=func.now())
    payment_status_id = Column(Integer, ForeignKey("payment_statuses.status_id"), default=1)
