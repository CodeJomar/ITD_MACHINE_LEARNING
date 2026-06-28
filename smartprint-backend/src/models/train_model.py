import pandas as pd
import numpy as np
import joblib
import os
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestRegressor

print("🚀 Entrenando modelo con arquitectura de carpetas definida...")

# 1. Cargar el dataset desde la carpeta scripts (en la raíz del backend)
# Subir dos niveles: src/models/train_model.py -> ../.. -> raiz del backend
csv_path = os.path.join('..', '..', 'scripts', 'historial_impresiones_24_meses.csv')
df = pd.read_csv(csv_path)

# ... (lógica de preprocesamiento, One-Hot Encoding, etc. igual que antes) ...
X = df.drop(columns=['tiempo_produccion_minutos', 'retraso_critico'])
y = df['tiempo_produccion_minutos']
X = pd.get_dummies(X, columns=['tipo_impresion', 'material'], drop_first=False)
model_columns = list(X.columns)

# 2. Entrenar
model = RandomForestRegressor(n_estimators=100, random_state=42)
model.fit(X, y) # Usamos todo el dataset para el modelo de producción final

# 3. Guardar en la carpeta models (donde está este script)
model_dir = os.path.dirname(os.path.abspath(__file__))
os.makedirs(model_dir, exist_ok=True)

joblib.dump(model, os.path.join(model_dir, 'modelo_smartprint.pkl'))
joblib.dump(model_columns, os.path.join(model_dir, 'columnas_modelo.pkl'))

print(f"💾 Modelo y columnas guardados correctamente en: {model_dir}")