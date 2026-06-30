# SmartPrint MVP - Backend

## 🚀 Descripción del Proyecto
Este backend funciona como un **Microservicio de Inteligencia Artificial** independiente. Su propósito principal no es gestionar el almacenamiento de datos (función delegada al Frontend mediante Supabase), sino actuar como un motor predictivo especializado para optimizar los tiempos de producción en la imprenta utilizando algoritmos de **Random Forest Regressor**

## 🛠️ Tecnologías Utilizadas

- **FastAPI**: Servidor web de alto rendimiento para exponer los endpoints de predicción.
- **Scikit-Learn**: Algoritmos de Random Forest para la predicción de tiempos de producción.
- **Pandas**: Procesamiento y transformación de datasets industriales.
- **Pydantic**: Gestión de contratos de datos (DTOs) para asegurar la integridad de la API.
- **Pathlib**: Gestión de rutas multiplataforma para una ejecución robusta.

## ⚙️ Control de Operaciones (CLI)

El sistema utiliza un patrón de Entry Points que permite controlar el proyecto desde la raíz mediante la terminal:

- **Entrenamiento y Data**: Ejecuta `python main_ml.py`. Este panel interactivo permite generar datasets sintéticos, entrenar el modelo y exportar los archivos `.pkl` de forma automática.
- **Servidor API**: Ejecuta `python main_api.py`. Inicia el servidor de producción que carga los modelos en memoria y expone el endpoint `/api/predecir-tiempo`.

## 🧪 Integración y Uso

1. **Instalación**: `pip install -r requirements.txt`.
2. **Entrenamiento**: Asegúrate de ejecutar `main_ml.py` para generar el cerebro predictivo (`modelo_smartprint.pkl`) en `src/models/`.
3. **Servidor**: Lanza `main_api.py` y accede a `http://localhost:8000/docs` para visualizar la documentación interactiva de Swagger UI.

## 📜 Filosofía de Diseño

Este backend está desacoplado del almacenamiento. Al funcionar bajo una arquitectura BaaS (Backend as a Service), el servidor recibe datos brutos de la interfaz, realiza el cálculo matemático de inferencia y devuelve la predicción sin necesidad de gestionar consultas SQL complejas, garantizando una latencia mínima.

## 🏗️ Arquitectura del Sistema
El proyecto sigue el principio de **Separación de Responsabilidades**, dividiendo la lógica en una arquitectura modular empresarial.

### Estructura de Directorios
```text
smartprint-backend/
├── src/
│   ├── app/              # Capa Web (FastAPI)
│   │   ├── api/          # Controladores (Routes)
│   │   ├── core/         # Infraestructura (Loaders/Singleton)
│   │   ├── service/      # Lógica de negocio (IA Inference)
│   │   └── dtos/         # Esquemas de datos (Pydantic)
│   ├── ml/               # Motor de IA (Entrenamiento)
│   ├── data/             # Historial de dataset
│   └── models/           # Cerebro entrenado (.pkl)
├── main_ml.py            # Panel de control de IA (CLI)
├── main_api.py           # Entry point del servidor
└── requirements.txt