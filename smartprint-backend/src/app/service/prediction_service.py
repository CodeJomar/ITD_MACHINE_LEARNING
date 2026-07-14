import pandas as pd
from fastapi import HTTPException
from src.app.core.ml_loader import MLLoader
from src.app.dtos.prediction_dto import PedidoInputDTO, InventoryDemandRequest

class PredictionService:
    # Método para el Objetivo 1 (Tiempos de Impresión)
    @staticmethod
    def ejecutar_prediccion(pedido: PedidoInputDTO) -> dict:
        modelo = MLLoader.obtener_modelo()
        columnas_entrenamiento = MLLoader.obtener_columnas()

        if not modelo or not columnas_entrenamiento:
            raise HTTPException(status_code=500, detail="El motor analítico de Tiempos no está operativo.")

        try:
            df_entrada = pd.DataFrame([pedido.dict()])
            df_entrada = pd.get_dummies(df_entrada)
            df_final = df_entrada.reindex(columns=columnas_entrenamiento, fill_value=0)
            
            tiempo_predicho = float(modelo.predict(df_final)[0])
            riesgo = "Alto" if tiempo_predicho > 120 else "Medio" if tiempo_predicho > 60 else "Bajo"

            return {
                "status": "success",
                "tiempo_estimado_minutos": round(tiempo_predicho, 2),
                "nivel_riesgo": riesgo,
                "detalles": pedido
            }
        except Exception as e:
            raise HTTPException(status_code=400, detail=f"Fallo en el procesamiento predictivo (Tiempos): {str(e)}")
    
    # Método para el Objetivo 2 (Clasificación de Riesgo)
    @staticmethod
    def ejecutar_prediccion_riesgo(pedido: PedidoInputDTO) -> dict:
        modelo_riesgo = MLLoader.obtener_modelo_riesgo()
        columnas_riesgo = MLLoader.obtener_columnas_riesgo()

        if not modelo_riesgo or not columnas_riesgo:
            raise HTTPException(status_code=500, detail="El motor de Riesgo (Clasificación) no está operativo.")

        try:
            datos_dict = pedido.dict()
            datos_dict['cantidad_tiraje'] = datos_dict.pop('cantidad') 
            
            df_entrada = pd.DataFrame([datos_dict])
            df_entrada = pd.get_dummies(df_entrada)
            df_final = df_entrada.reindex(columns=columnas_riesgo, fill_value=0)
            
            prediccion = int(modelo_riesgo.predict(df_final)[0])
            label = "Alto Riesgo 🔴" if prediccion == 1 else "Riesgo Controlado 🟢"

            return {
                "riesgo_valor": prediccion,
                "riesgo_label": label
            }
        except Exception as e:
            raise HTTPException(status_code=400, detail=f"Fallo en modelo de riesgo: {str(e)}")

    # Método para el Objetivo 3 (Regresión Lineal de Inventario)
    @staticmethod
    def predict_inventory_demand(data: InventoryDemandRequest) -> dict:
        modelo_inventario = MLLoader.obtener_modelo_inventario()
        columnas_inventario = MLLoader.obtener_columnas_inventario()

        if not modelo_inventario or not columnas_inventario:
            raise HTTPException(status_code=500, detail="El motor de Inventario (Regresión Lineal) no está operativo.")

        try:
            # Crear DataFrame con los datos exactos del request
            df_entrada = pd.DataFrame([data.dict()])
            
            # Alinear columnas (por si acaso, aunque en este modelo no hay One-Hot Encoding)
            df_final = df_entrada.reindex(columns=columnas_inventario, fill_value=0)
            
            # Realizar la predicción
            litros_predichos = float(modelo_inventario.predict(df_final)[0])
            
            # Formatear el mensaje a enviar al frontend
            mensaje_ui = f"Necesitarás aprox. {round(litros_predichos, 1)} Litros de Tinta el próximo mes."

            return {
                "proyeccion_tinta_litros": round(litros_predichos, 2),
                "mensaje": mensaje_ui
            }
        except Exception as e:
            raise HTTPException(status_code=400, detail=f"Fallo en proyección de demanda: {str(e)}")