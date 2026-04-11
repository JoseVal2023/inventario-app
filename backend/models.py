from sqlalchemy import Column, Integer, String, Numeric, ForeignKey
from sqlalchemy.orm import relationship
from database import Base

class Producto(Base):
    __tablename__ = "productos"

    id = Column(Integer, primary_key=True)
    nombre = Column(String, nullable=False)
    precio = Column(Numeric, nullable=False)
    cantidad = Column(Integer, default=0)
    stock_minimo = Column(Integer, default=5)
    categoria_id = Column(Integer, ForeignKey("categorias.id"))
    qr_code = Column(String)