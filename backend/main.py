from fastapi import FastAPI, Depends
from database import get_db
from sqlalchemy.orm import Session
from models import Producto, Categoria, HistorialMovimiento
from schemas import ProductoCreate, ProductoUpdate, CategoriaCreate, MovimientoCreate


app = FastAPI()

@app.get("/")
def inicio():
    return {"mensaje": "Servidor funcionando correctamente"}

@app.get("/productos")
def obtener_productos(db: Session = Depends(get_db)):
    productos = db.query(Producto).all()
    return {"productos": productos}

@app.post("/productos")
def crear_producto(producto: ProductoCreate, db: Session = Depends(get_db)):
    nuevo_producto = Producto(
        nombre=producto.nombre,
        precio=producto.precio,
        cantidad=producto.cantidad,
        stock_minimo=producto.stock_minimo,
        categoria_id=producto.categoria_id,
        qr_code=producto.qr_code
    )
    db.add(nuevo_producto)
    db.commit()
    db.refresh(nuevo_producto)
    return nuevo_producto

@app.put("/productos/{id}")
def actualizar_producto(id: int, producto: ProductoUpdate, db: Session = Depends(get_db)):
    producto_db = db.query(Producto).filter(Producto.id == id).first()
    if not producto_db:
        return {"error": "Producto no encontrado"}
    if producto.nombre is not None:
        producto_db.nombre = producto.nombre
    if producto.precio is not None:
        producto_db.precio = producto.precio
    if producto.cantidad is not None:
        producto_db.cantidad = producto.cantidad
    if producto.stock_minimo is not None:
        producto_db.stock_minimo = producto.stock_minimo
    if producto.categoria_id is not None:
        producto_db.categoria_id = producto.categoria_id
    if producto.qr_code is not None:
        producto_db.qr_code = producto.qr_code
    db.commit()
    db.refresh(producto_db)
    return producto_db

@app.delete("/productos/{id}")
def eliminar_producto(id: int, db: Session = Depends(get_db)):
    producto_db = db.query(Producto).filter(Producto.id == id).first()
    if not producto_db:
        return {"error": "Producto no encontrado"}
    db.delete(producto_db)
    db.commit()
    return {"mensaje": "Producto eliminado correctamente"}


@app.get("/categorias")
def obtener_categorias(db: Session = Depends(get_db)):
    categorias = db.query(Categoria).all()
    return {"categorias": categorias}

@app.post("/categorias")
def crear_categoria(categoria: CategoriaCreate, db: Session = Depends(get_db)):
    nueva_categoria = Categoria(nombre=categoria.nombre)
    db.add(nueva_categoria)
    db.commit()
    db.refresh(nueva_categoria)
    return nueva_categoria

@app.delete("/categorias/{id}")
def eliminar_categoria(id: int, db: Session = Depends(get_db)):
    categoria_db = db.query(Categoria).filter(Categoria.id == id).first()
    if not categoria_db:
        return {"error": "Categoría no encontrada"}
    db.delete(categoria_db)
    db.commit()
    return {"mensaje": "Categoría eliminada correctamente"}

@app.post("/productos/{id}/agregar")
def agregar_stock(id: int, movimiento: MovimientoCreate, db: Session = Depends(get_db)):
    producto_db = db.query(Producto).filter(Producto.id == id).first()
    if not producto_db:
        return {"error": "Producto no encontrado"}
    producto_db.cantidad += movimiento.cantidad
    nuevo_movimiento = HistorialMovimiento(
        producto_id=id,
        accion="agregar",
        cantidad=movimiento.cantidad,
        origen=movimiento.origen
    )
    db.add(nuevo_movimiento)
    db.commit()
    db.refresh(producto_db)
    return {"mensaje": "Stock actualizado", "cantidad_actual": producto_db.cantidad}

@app.post("/productos/{id}/descontar")
def descontar_stock(id: int, movimiento: MovimientoCreate, db: Session = Depends(get_db)):
    producto_db = db.query(Producto).filter(Producto.id == id).first()
    if not producto_db:
        return {"error": "Producto no encontrado"}
    producto_db.cantidad -= movimiento.cantidad
    nuevo_movimiento = HistorialMovimiento(
        producto_id=id,
        accion="descontar",
        cantidad=movimiento.cantidad,
        origen=movimiento.origen
    )
    db.add(nuevo_movimiento)
    db.commit()
    db.refresh(producto_db)
    return {"mensaje": "Stock actualizado", "cantidad_actual": producto_db.cantidad}

@app.get("/historial")
def obtener_historial(db: Session = Depends(get_db)):
    historial = db.query(HistorialMovimiento).all()
    return {"historial": historial}