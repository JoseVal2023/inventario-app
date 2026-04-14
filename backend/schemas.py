from pydantic import BaseModel
from typing import Optional

class ProductoCreate(BaseModel):
    nombre: str
    precio: float
    cantidad: int 
    stock_minimo: int
    categoria_id: Optional[int] = None
    qr_code: Optional[str] = None
    
class ProductoUpdate(BaseModel):
    nombre : Optional[str] = None
    precio : Optional[float] = None
    cantidad : Optional[int] = None
    stock_minimo : Optional[int] = None
    categoria_id : Optional[int] = None
    qr_code : Optional[str] = None