import joblib
from pathlib import Path

# Calcular ruta dinámica subiendo 3 niveles (core -> app -> src -> raíz)
BASE_DIR = Path(__file__).resolve().parent.parent.parent.parent
MODELS_DIR = BASE_DIR / 'src' / 'models'
MODEL_FILE = MODELS_DIR / 'modelo_smartprint.pkl'
COLUMNS_FILE = MODELS_DIR / 'columnas_modelo.pkl'

class MLLoader:
    _modelo = None
    _columnas = None

    @classmethod
    def cargar_modelos(cls):
        if cls._modelo is None or cls._columnas is None:
            try:
                cls._modelo = joblib.load(MODEL_FILE)
                cls._columnas = joblib.load(COLUMNS_FILE)
                print("[Core] Cerebro matemático (.pkl) inyectado en memoria con éxito.")
            except Exception as e:
                print(f"[Core] Alerta: No se pudieron cargar los archivos .pkl: {e}")
                cls._modelo = None
                cls._columnas = None

    @classmethod
    def obtener_modelo(cls):
        if cls._modelo is None:
            cls.cargar_modelos()
        return cls._modelo

    @classmethod
    def obtener_columnas(cls):
        if cls._columnas is None:
            cls.cargar_modelos()
        return cls._columnas