import joblib
from pathlib import Path

# Calcular ruta dinámica subiendo 3 niveles
BASE_DIR = Path(__file__).resolve().parent.parent.parent.parent
MODELS_DIR = BASE_DIR / 'src' / 'models'

# Rutas del Modelo 1 (Regresión de Tiempos)
MODEL_FILE = MODELS_DIR / 'modelo_smartprint.pkl'
COLUMNS_FILE = MODELS_DIR / 'columnas_modelo.pkl'

# Rutas del Modelo 2 (Clasificación de Riesgo)
MODEL_RIESGO_FILE = MODELS_DIR / 'modelo_riesgo.pkl'
COLUMNS_RIESGO_FILE = MODELS_DIR / 'columnas_riesgo.pkl'
SCALER_RIESGO_FILE = MODELS_DIR / 'scaler_riesgo.pkl'

# NUEVO: Rutas del Modelo 3 (Regresión Lineal - Inventario)
MODEL_INVENTARIO_FILE = MODELS_DIR / 'modelo_inventario.pkl'
COLUMNS_INVENTARIO_FILE = MODELS_DIR / 'columnas_inventario.pkl'

class MLLoader:
    # Atributos para el Objetivo 1
    _modelo = None
    _columnas = None
    
    # Atributos para el Objetivo 2
    _modelo_riesgo = None
    _columnas_riesgo = None
    _scaler_riesgo = None

    # Atributos para el Objetivo 3
    _modelo_inventario = None
    _columnas_inventario = None

    @classmethod
    def cargar_modelos(cls):
        # 1. Cargar modelo de Tiempos
        if cls._modelo is None or cls._columnas is None:
            try:
                cls._modelo = joblib.load(MODEL_FILE)
                cls._columnas = joblib.load(COLUMNS_FILE)
                print("[Core] Cerebro matemático Tiempos (.pkl) inyectado con éxito.")
            except Exception as e:
                print(f"[Core] Alerta: No se pudieron cargar los .pkl de Tiempos: {e}")

        # 2. Cargar modelo de Riesgo
        if cls._modelo_riesgo is None or cls._columnas_riesgo is None or cls._scaler_riesgo is None:
            try:
                cls._modelo_riesgo = joblib.load(MODEL_RIESGO_FILE)
                cls._columnas_riesgo = joblib.load(COLUMNS_RIESGO_FILE)
                cls._scaler_riesgo = joblib.load(SCALER_RIESGO_FILE)
                print("[Core] Cerebro matemático Riesgo (.pkl) y Scaler inyectados con éxito.")
            except Exception as e:
                print(f"[Core] Alerta: No se pudieron cargar los .pkl de Riesgo: {e}")

        # 3. Cargar modelo de Inventario
        if cls._modelo_inventario is None or cls._columnas_inventario is None:
            try:
                cls._modelo_inventario = joblib.load(MODEL_INVENTARIO_FILE)
                cls._columnas_inventario = joblib.load(COLUMNS_INVENTARIO_FILE)
                print("[Core] Cerebro matemático Inventario (.pkl) inyectado con éxito.")
            except Exception as e:
                print(f"[Core] Alerta: No se pudieron cargar los .pkl de Inventario: {e}")

    # Getters Modelo 1
    @classmethod
    def obtener_modelo(cls):
        if cls._modelo is None: cls.cargar_modelos()
        return cls._modelo

    @classmethod
    def obtener_columnas(cls):
        if cls._columnas is None: cls.cargar_modelos()
        return cls._columnas

    # Getters Modelo 2
    @classmethod
    def obtener_modelo_riesgo(cls):
        if cls._modelo_riesgo is None: cls.cargar_modelos()
        return cls._modelo_riesgo

    @classmethod
    def obtener_columnas_riesgo(cls):
        if cls._columnas_riesgo is None: cls.cargar_modelos()
        return cls._columnas_riesgo
    
    @classmethod
    def obtener_scaler_riesgo(cls):
        if cls._scaler_riesgo is None: cls.cargar_modelos()
        return cls._scaler_riesgo

    # Getters Modelo 3
    @classmethod
    def obtener_modelo_inventario(cls):
        if cls._modelo_inventario is None: cls.cargar_modelos()
        return cls._modelo_inventario

    @classmethod
    def obtener_columnas_inventario(cls):
        if cls._columnas_inventario is None: cls.cargar_modelos()
        return cls._columnas_inventario