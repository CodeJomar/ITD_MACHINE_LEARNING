import pandas as pd
import numpy as np
import os

def generar_dataset_riesgo():
    np.random.seed(42)
    n_records = 1000

    # Variables de entrada
    cantidad_tiraje = np.random.randint(50, 10000, n_records)
    ancho_cm = np.random.uniform(20.0, 150.0, n_records)
    alto_cm = np.random.uniform(20.0, 200.0, n_records)
    material_id = np.random.randint(1, 5, n_records)
    catalogo_id = np.random.randint(1, 4, n_records)

    # Lógica de Riesgo (1 = Alto riesgo, 0 = Sin riesgo)
    riesgo_retraso_critico = np.where(
        (cantidad_tiraje > 5000) & (material_id >= 3), 1, 
        np.where(cantidad_tiraje > 8000, 1, 0)
    )

    df = pd.DataFrame({
        'cantidad_tiraje': cantidad_tiraje,
        'ancho_cm': ancho_cm,
        'alto_cm': alto_cm,
        'material_id': material_id,
        'catalogo_id': catalogo_id,
        'riesgo_retraso_critico': riesgo_retraso_critico
    })

    # CORRECCIÓN: Rutas dinámicas hacia src/data/
    base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__))) # Sube a src/
    data_dir = os.path.join(base_dir, 'data') # Entra a data/
    os.makedirs(data_dir, exist_ok=True) # Crea la carpeta si no existe por algún motivo
    
    file_path = os.path.join(data_dir, 'retrasos_historicos.csv')
    df.to_csv(file_path, index=False)
    
    print(f"✅ Dataset de riesgo generado en: {file_path}")
    print(f"Distribución de Riesgo:\n{df['riesgo_retraso_critico'].value_counts()}")

if __name__ == "__main__":
    generar_dataset_riesgo()