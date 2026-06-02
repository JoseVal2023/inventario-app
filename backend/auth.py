from jose import JWTError, jwt
from datetime import datetime, timedelta
import hashlib

SECRET_KEY = "inventario_secret_key_2026"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 480

def encriptar_contrasena(contrasena: str):
    return hashlib.sha256(contrasena.encode()).hexdigest()

def verificar_contrasena(contrasena: str, hash: str):
    return hashlib.sha256(contrasena.encode()).hexdigest() == hash

def crear_token(data: dict):
    datos = data.copy()
    expira = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    datos.update({"exp": expira})
    return jwt.encode(datos, SECRET_KEY, algorithm=ALGORITHM)

def verificar_token(token: str):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return payload
    except JWTError:
        return None