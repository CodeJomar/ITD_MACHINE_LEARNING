FROM python:3.10-slim

# Evitamos que Python genere archivos .pyc y forzamos el output en consola
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

# Directorio de trabajo dentro del contenedor
WORKDIR /app

# Copiamos primero el requirements.txt para aprovechar el caché de Docker
COPY requirements.txt .

# Instalamos las dependencias (FastAPI, Uvicorn, Pandas, Scikit-learn, etc.)
RUN pip install --no-cache-dir -r requirements.txt

# Copiamos el resto del código del backend
COPY . .

# Exponemos el puerto de FastAPI
EXPOSE 8000

# Comando para ejecutar el servidor (apuntando a src/app/main.py)
CMD ["uvicorn", "src.app.main:app", "--host", "0.0.0.0", "--port", "8000"]