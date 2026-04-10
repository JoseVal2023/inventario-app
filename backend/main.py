from fastapi import FastAPI

app = FastAPI()

@app.get("/")
def inicio():
    return  {"mensaje": "Servidor funcionando correctamente"}

@app.get("/productos")
def obtener_productos():
    return{"prductos": []}