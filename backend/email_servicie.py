import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from dotenv import load_dotenv
import os

load_dotenv()
EMAIL_SENDER = os.getenv("EMAIL_SENDER")
EMAIL_PASSWORD = os.getenv("EMAIL_PASSWORD")

def enviar_alerta_stock(nombre_producto, cantidad_actual, stock_minimo, email_destino):
    asunto = f"Alerta de stock bajo: {nombre_producto}"
    cuerpo = f"""
    EL PRODUCTO {nombre_producto} tiene stock bajo.
    
    Cantidad actual: {cantidad_actual}
    Stock minimo: {stock_minimo}
    
    Por favor reponga el stock a la brevedad.
    """
    mensaje = MIMEMultipart()
    mensaje["From"] = EMAIL_SENDER
    mensaje["To"] = email_destino
    mensaje["Subject"] = asunto
    mensaje.attach(MIMEText(cuerpo, "plain"))
    
    with smtplib.SMTP_SSL("smtp.gmail.com", 465) as servidor:
        servidor.login(EMAIL_SENDER, EMAIL_PASSWORD)
        servidor.sendmail(EMAIL_SENDER, email_destino mensaje.as_string())
    