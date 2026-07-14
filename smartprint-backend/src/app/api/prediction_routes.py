from fastapi import APIRouter
from src.app.dtos.prediction_dto import PedidoInputDTO, PrediccionResponseDTO, RiskPredictionResponseDTO, InventoryDemandRequest, InventoryDemandResponse
from src.app.service.prediction_service import PredictionService

router = APIRouter(prefix="/api", tags=["Machine Learning Engine"])

@router.post("/predecir-tiempo", response_model=PrediccionResponseDTO)
def mapear_prediccion(pedido: PedidoInputDTO):
    return PredictionService.ejecutar_prediccion(pedido)

@router.post("/predecir-riesgo", response_model=RiskPredictionResponseDTO)
def mapear_prediccion_riesgo(pedido: PedidoInputDTO):
    return PredictionService.ejecutar_prediccion_riesgo(pedido)

# NUEVO: Endpoint para el Objetivo 3
@router.post("/predict-inventory", response_model=InventoryDemandResponse)
def predict_inventory_demand(data: InventoryDemandRequest):
    return PredictionService.predict_inventory_demand(data)