from pydantic import BaseModel

class PedidoInputDTO(BaseModel):
    tipo_impresion: str
    material: str
    cantidad: int
    ancho_cm: float
    alto_cm: float

class PrediccionResponseDTO(BaseModel):
    status: str
    tiempo_estimado_minutos: float
    nivel_riesgo: str
    detalles: PedidoInputDTO

class RiskPredictionResponseDTO(BaseModel):
    riesgo_valor: int
    riesgo_label: str

class InventoryDemandRequest(BaseModel):
    pedidos_esperados_mes: int
    promedio_tiraje_mensual: int
    es_campana_alta: int  # 0 o 1

class InventoryDemandResponse(BaseModel):
    proyeccion_tinta_litros: float
    mensaje: str