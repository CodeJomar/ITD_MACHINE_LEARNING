import pandas as pd
import numpy as np
from pathlib import Path

# Configurar rutas
BASE_DIR = Path(__file__).resolve().parent.parent
DATA_DIR = BASE_DIR / 'data'
DATA_DIR.mkdir(parents=True, exist_ok=True)
FILE_PATH = DATA_DIR / 'historico_consumo_mensual.csv'

def generar_dataset_inventario():
    np.random.seed(42)
    meses = 48 # 4 años de datos históricos
    
    # Variables predictoras (X)
    pedidos_esperados = np.random.randint(50, 400, meses)
    promedio_tiraje = np.random.randint(1000, 10000, meses)
    # 1 de cada 5 meses en promedio es campaña alta (ej. elecciones, fin de año)
    es_campana = np.random.choice([0, 1], meses, p=[0.8, 0.2])
    
    # Lógica mock para la variable objetivo (Y)
    # Consumo base + (efecto pedidos) + (efecto tiraje) + (efecto campaña) + ruido estadístico
    consumo_tinta = (
        20.0 + 
        (pedidos_esperados * 0.15) + 
        (promedio_tiraje * 0.005) + 
        (es_campana * 50.0) + 
        np.random.normal(0, 5, meses) # Ruido para que no sea perfecto
    )
    
    df = pd.DataFrame({
        'pedidos_esperados_mes': pedidos_esperados,
        'promedio_tiraje_mensual': promedio_tiraje,
        'es_campana_alta': es_campana,
        'consumo_tinta_litros': np.round(consumo_tinta, 2)
    })
    
    df.to_csv(FILE_PATH, index=False)
    print(f"Dataset de inventario generado exitosamente en: {FILE_PATH}")

if __name__ == "__main__":
    generar_dataset_inventario()