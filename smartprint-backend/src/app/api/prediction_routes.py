from fastapi import APIRouter
from src.app.dtos.prediction_dto import PedidoInputDTO, PrediccionResponseDTO
from src.app.service.prediction_service import PredictionService

router = APIRouter(prefix="/api", tags=["Machine Learning Engine"])

@router.post("/predecir-tiempo", response_model=PrediccionResponseDTO)
def mapear_prediccion(pedido: PedidoInputDTO):
    return PredictionService.ejecutar_prediccion(pedido)