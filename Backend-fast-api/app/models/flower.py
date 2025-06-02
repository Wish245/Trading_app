# from sqlalchemy import Column, Integer, String, ForeignKey, Text
# from app.db.base import Base

# class FlowerCategory(Base):
#     __tablename__ = "flower_categories"
#     category_id = Column(Integer, primary_key=True)
#     category_name = Column(String(100), unique=True, nullable=False)

# class Flower(Base):
#     __tablename__ = "flowers"
#     flower_id = Column(Integer, primary_key=True)
#     flower_name = Column(String(100), nullable=False)
#     flower_img_path = Column(Text)
#     category_id = Column(Integer, ForeignKey("flower_categories.category_id", ondelete="SET NULL"))

# class FlowerTranslation(Base):
#     __tablename__ = "flower_translations"
#     flower_translation_id = Column(Integer, primary_key=True)
#     flower_id = Column(Integer, ForeignKey("flowers.flower_id", ondelete="CASCADE"), nullable=False)
#     language_code = Column(String(2), nullable=False)
#     translated_name = Column(String(100))
