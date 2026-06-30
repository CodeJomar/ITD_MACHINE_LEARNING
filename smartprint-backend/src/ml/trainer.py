import pandas as pd
import numpy as np
import joblib
from pathlib import Path
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestRegressor
from sklearn.metrics import mean_absolute_error, r2_score

BASE_DIR = Path(__file__).resolve().parent.parent
DATA_DIR = BASE_DIR / 'data'
MODELS_DIR = BASE_DIR / 'models'

CSV_PATH = DATA_DIR / 'historial_impresiones.csv'
MODEL_FILE = MODELS_DIR / 'modelo_smartprint.pkl'
COLUMNS_FILE = MODELS_DIR / 'columnas_modelo.pkl'

def entrenar_modelo():
    print("\nIniciando el Pipeline de Entrenamiento de Inteligencia Artificial...")
    
    if not CSV_PATH.exists():
        print(f"Error crítico: No se encontró el dataset en {CSV_PATH}.")
        print("Solución: Ejecuta primero la opción 1 del menú para generar la data.")
        return

    MODELS_DIR.mkdir(parents=True, exist_ok=True)

    # 1. Cargar datos
    df = pd.read_csv(CSV_PATH)
    X = df.drop(columns=['tiempo_produccion_minutos', 'retraso_critico'])
    y = df['tiempo_produccion_minutos']
    
    # 2. Preprocesamiento (One-Hot Encoding)
    X = pd.get_dummies(X, columns=['tipo_impresion', 'material'], drop_first=False)
    model_columns = list(X.columns)

    # 3. División y Entrenamiento
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

    print("Entrenando algoritmo Random Forest Regressor (Esto puede tomar unos segundos)...")
    model = RandomForestRegressor(n_estimators=100, random_state=42, max_depth=15)
    model.fit(X_train, y_train)

    # 4. Evaluación
    y_pred = model.predict(X_test)
    print("\n================ MÉTRICAS DEL MODELO ================")
    print(f"Error Absoluto Medio (MAE): {mean_absolute_error(y_test, y_pred):.2f} minutos")
    print(f"Precisión (R² Score): {r2_score(y_test, y_pred) * 100:.2f}%")
    print("=====================================================\n")

    # 5. Exportar el "cerebro"
    joblib.dump(model, MODEL_FILE)
    joblib.dump(model_columns, COLUMNS_FILE)
    print(f"Modelo (.pkl) guardado exitosamente en: {MODELS_DIR}")