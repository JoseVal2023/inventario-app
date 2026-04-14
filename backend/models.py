from sqlalchemy import Column, Integer, String, Numeric, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from database import Base
from sqlalchemy.sql import func

class Categoria(Base):
    __tablename__ = "categorias"

    id = Column(Integer, primary_key=True)
    nombre = Column(String, nullable=False)

class Producto(Base):
    __tablename__ = "productos"

    id = Column(Integer, primary_key=True)
    nombre = Column(String, nullable=False)
    precio = Column(Numeric, nullable=False)
    cantidad = Column(Integer, default=0)
    stock_minimo = Column(Integer, default=5)
    categoria_id = Column(Integer, ForeignKey("categorias.id"))
    qr_code = Column(String)
    
class HistorialMovimiento(Base):
    __tablename__ = "historial_movimientos"
    
    id = Column(Integer, primary_key=True)
    producto_id = Column(Integer, ForeignKey("productos.id"))
    accion = Column(String, nullable=False)
    cantidad = Column(Numeric, nullable=False)
    fecha = Column(DateTime, default=func.now())
    origen = Column(String, nullable=False)