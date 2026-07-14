import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LinearRegression
from sklearn.metrics import r2_score, mean_squared_error
import joblib
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent
DATA_FILE = BASE_DIR / 'data' / 'historico_consumo_mensual.csv'
MODELS_DIR = BASE_DIR / 'models'
MODELS_DIR.mkdir(parents=True, exist_ok=True)

MODEL_FILE = MODELS_DIR / 'modelo_inventario.pkl'
COLUMNS_FILE = MODELS_DIR / 'columnas_inventario.pkl'

def entrenar_modelo_inventario():
    # 1. Cargar datos
    df = pd.read_csv(DATA_FILE)
    
    # 2. Separar variables X e Y
    X = df[['pedidos_esperados_mes', 'promedio_tiraje_mensual', 'es_campana_alta']]
    y = df['consumo_tinta_litros']
    
    # 3. División de datos (80% entrenamiento, 20% prueba)
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
    
    # 4. Entrenar modelo
    modelo = LinearRegression()
    modelo.fit(X_train, y_train)
    
    # 5. Validar modelo
    y_pred = modelo.predict(X_test)
    r2 = r2_score(y_test, y_pred)
    mse = mean_squared_error(y_test, y_pred)
    
    print("=== MÉTRICAS DEL MODELO DE INVENTARIO (REGRESIÓN LINEAL) ===")
    print(f"Coeficiente de Determinación (R2): {r2:.4f}")
    print(f"Error Cuadrático Medio (MSE): {mse:.4f}")
    
    # 6. Exportar modelo y columnas
    joblib.dump(modelo, MODEL_FILE)
    joblib.dump(list(X.columns), COLUMNS_FILE)
    print(f"\nModelo exportado exitosamente en: {MODEL_FILE}")

if __name__ == "__main__":
    entrenar_modelo_inventario()