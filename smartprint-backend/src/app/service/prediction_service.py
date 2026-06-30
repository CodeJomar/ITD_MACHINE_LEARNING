import pandas as pd
from fastapi import HTTPException
from src.app.core.ml_loader import MLLoader
from src.app.dtos.prediction_dto import PedidoInputDTO

class PredictionService:
    @staticmethod
    def ejecutar_prediccion(pedido: PedidoInputDTO) -> dict:
        modelo = MLLoader.obtener_modelo()
        columnas_entrenamiento = MLLoader.obtener_columnas()

        if not modelo or not columnas_entrenamiento:
            raise HTTPException(
                status_code=500, 
                detail="El motor analítico de Machine Learning no está operativo en el servidor."
            )

        try:
            # 1. Convertir DTO estructurado a DataFrame de una fila
            df_entrada = pd.DataFrame([pedido.dict()])
            
            # 2. Aplicar One-Hot Encoding exacto
            df_entrada = pd.get_dummies(df_entrada)
            
            # 3. Alinear dimensiones de la matriz rellenando con ceros
            df_final = df_entrada.reindex(columns=columnas_entrenamiento, fill_value=0)
            
            # 4. Realizar inferencia con el Random Forest
            tiempo_predicho = float(modelo.predict(df_final)[0])
            
            # 5. Clasificación de riesgo de retraso basada en el umbral del taller
            riesgo = "Alto" if tiempo_predicho > 120 else "Medio" if tiempo_predicho > 60 else "Bajo"

            return {
                "status": "success",
                "tiempo_estimado_minutos": round(tiempo_predicho, 2),
                "nivel_riesgo": riesgo,
                "detalles": pedido
            }
        except Exception as e:
            raise HTTPException(
                status_code=400, 
                detail=f"Fallo en el procesamiento de la matriz predictiva: {str(e)}"
            )