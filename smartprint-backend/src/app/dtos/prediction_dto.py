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