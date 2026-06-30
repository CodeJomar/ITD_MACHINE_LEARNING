from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from src.app.api.prediction_routes import router as ml_router
from src.app.core.ml_loader import MLLoader

app = FastAPI(
    title="SmartPrint API - Enterprise Core",
    description="Motor de Inteligencia Artificial para SmartPrint",
    version="1.0.0"
)

# Permitir que React (Frontend) consuma la API
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Evento para cargar el .pkl automáticamente al encender el servidor
@app.on_event("startup")
def on_startup():
    print("Levantando el motor de Machine Learning...")
    MLLoader.cargar_modelos()

# Ruta raíz para verificar que el servidor está vivo
@app.get("/", tags=["General"])
def check_health():
    return {"status": "online", "sistema": "SmartPrint MVP Backend"}

# Registrar el router de predicciones (Limpio y directo)
app.include_router(ml_router)