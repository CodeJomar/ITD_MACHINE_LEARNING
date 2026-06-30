import pandas as pd
import numpy as np
import random
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent
DATA_DIR = BASE_DIR / 'data'
CSV_PATH = DATA_DIR / 'historial_impresiones.csv'

def generar_dataset():
    DATA_DIR.mkdir(parents=True, exist_ok=True)
    
    print("\nGenerando 24 meses de historial de producción para SmartPrint...")
    np.random.seed(42)
    tipos_impresion = ['Digital', 'Offset', 'Plotter', 'Serigrafia']
    materiales_digital = ['Couché 150g', 'Bond 80g', 'Cartulina Hilo']
    materiales_offset = ['Couché 300g', 'Bond 90g', 'Folkote']
    materiales_plotter = ['Vinilo Adhesivo', 'Lona Banner', 'Microperforado']
    materiales_serigrafia = ['Tela', 'Cartón', 'Plástico']

    n_pedidos = 2000
    datos = []

    for _ in range(n_pedidos):
        tipo = random.choice(tipos_impresion)
        if tipo == 'Digital':
            material = random.choice(materiales_digital)
            cantidad = np.random.randint(50, 1000)
            ancho, alto = 21.0, 29.7
            tiempo_base = 10 + (cantidad * 0.05)
        elif tipo == 'Offset':
            material = random.choice(materiales_offset)
            cantidad = np.random.randint(1000, 50000)
            ancho, alto = 70.0, 100.0
            tiempo_base = 60 + (cantidad * 0.005)
        elif tipo == 'Plotter':
            material = random.choice(materiales_plotter)
            cantidad = np.random.randint(1, 50)
            ancho = np.random.uniform(50.0, 300.0)
            alto = np.random.uniform(50.0, 500.0)
            area_m2 = (ancho / 100) * (alto / 100)
            tiempo_base = 15 + (cantidad * area_m2 * 12)
        else:
            material = random.choice(materiales_serigrafia)
            cantidad = np.random.randint(50, 500)
            ancho, alto = 40.0, 50.0
            tiempo_base = 30 + (cantidad * 0.5)

        ruido_operativo = np.random.normal(loc=15.0, scale=10.0)
        tiempo_total_minutos = round(max(10, tiempo_base + ruido_operativo), 2)
        es_retraso = 1 if tiempo_total_minutos > (tiempo_base * 1.30) else 0

        datos.append([tipo, material, cantidad, round(ancho, 2), round(alto, 2), tiempo_total_minutos, es_retraso])

    columnas = ['tipo_impresion', 'material', 'cantidad', 'ancho_cm', 'alto_cm', 'tiempo_produccion_minutos', 'retraso_critico']
    df = pd.DataFrame(datos, columns=columnas)

    df.to_csv(CSV_PATH, index=False)
    print(f"¡Éxito! Dataset guardado en: {CSV_PATH}")