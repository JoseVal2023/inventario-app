from fastapi import FastAPI, Depends
from database import get_db
from sqlalchemy.orm import Session
from models import Producto

app = FastAPI()

@app.get("/")
def inicio():
    return  {"mensaje": "Servidor funcionando correctamente"}

@app.get("/productos")
def obtener_productos(db: Session = Depends(get_db)):
    productos = db.query(Producto).all()
    return{"productos": productos}