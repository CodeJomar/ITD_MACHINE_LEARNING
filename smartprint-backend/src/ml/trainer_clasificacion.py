import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LogisticRegression
from sklearn.preprocessing import StandardScaler
from sklearn.metrics import accuracy_score, recall_score
import joblib
import os

def entrenar_modelo_riesgo():
    # 1. Configurar rutas dinámicas
    base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    data_path = os.path.join(base_dir, 'data', 'retrasos_historicos.csv')
    models_dir = os.path.join(base_dir, 'models')
    os.makedirs(models_dir, exist_ok=True)
    
    # 2. Cargar datos
    if not os.path.exists(data_path):
        print(f"❌ Error: No se encontró el dataset en {data_path}. Corre el generador primero.")
        return
        
    df = pd.read_csv(data_path)
    
    # 3. Separar X e Y
    X = df.drop(columns=['riesgo_retraso_critico'])
    y = df['riesgo_retraso_critico']
    
    # 4. Aplicar One-Hot Encoding
    X_encoded = pd.get_dummies(X, columns=['material_id', 'catalogo_id'])
    
    # 5. Dividir dataset
    X_train, X_test, y_train, y_test = train_test_split(X_encoded, y, test_size=0.2, random_state=42)
    
    # 6. NORMALIZACIÓN (NUEVO)
    scaler = StandardScaler()
    X_train_scaled = scaler.fit_transform(X_train) # Aprende la escala y transforma
    X_test_scaled = scaler.transform(X_test)       # Solo transforma según lo aprendido
    
    # 7. Entrenar Regresión Logística
    modelo = LogisticRegression(max_iter=1000, class_weight='balanced')
    modelo.fit(X_train_scaled, y_train) # Entrenamos con datos normalizados!
    
    # 8. Evaluar
    y_pred = modelo.predict(X_test_scaled)
    print(f"📊 Accuracy del modelo de Riesgo: {accuracy_score(y_test, y_pred):.2f}")
    print(f"🎯 Recall del modelo (Sensibilidad): {recall_score(y_test, y_pred):.2f}")
    
    # 9. Guardar los TRES cerebros en la carpeta models/
    joblib.dump(modelo, os.path.join(models_dir, 'modelo_riesgo.pkl'))
    joblib.dump(list(X_encoded.columns), os.path.join(models_dir, 'columnas_riesgo.pkl'))
    joblib.dump(scaler, os.path.join(models_dir, 'scaler_riesgo.pkl')) # NUEVO: Guardamos el escalador
    
    print("✅ LogisticRegression, Columnas y StandardScaler exportados correctamente a src/models/")

if __name__ == "__main__":
    entrenar_modelo_riesgo()