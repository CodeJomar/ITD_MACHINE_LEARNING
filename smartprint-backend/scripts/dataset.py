import pandas as pd
import numpy as np
import os
import random

os.makedirs('scripts', exist_ok=True)

# Fijamos una semilla para que los resultados sean reproducibles (siempre genere los mismos datos)
np.random.seed(42)

# Definimos nuestras variables categóricas
tipos_impresion = ['Digital', 'Offset', 'Plotter', 'Serigrafia']
materiales_digital = ['Couché 150g', 'Bond 80g', 'Cartulina Hilo']
materiales_offset = ['Couché 300g', 'Bond 90g', 'Folkote']
materiales_plotter = ['Vinilo Adhesivo', 'Lona Banner', 'Microperforado']
materiales_serigrafia = ['Tela', 'Cartón', 'Plástico']

# Simularemos 2000 pedidos (aprox 24 meses de trabajo de una imprenta mediana)
n_pedidos = 2000
datos = []

print("⚙️ Generando 24 meses de historial de producción...")

for _ in range(n_pedidos):
    # 1. Elegir el tipo de impresión y su material correspondiente
    tipo = random.choice(tipos_impresion)
    
    if tipo == 'Digital':
        material = random.choice(materiales_digital)
        cantidad = np.random.randint(50, 1000)
        ancho, alto = 21.0, 29.7 # Formato A4 estándar
        # Lógica de tiempo: setup rápido (10 min), tiempo por hoja medio + ruido
        tiempo_base = 10 + (cantidad * 0.05)
        
    elif tipo == 'Offset':
        material = random.choice(materiales_offset)
        cantidad = np.random.randint(1000, 50000)
        ancho, alto = 70.0, 100.0 # Pliegos grandes
        # Lógica de tiempo: setup altísimo (quemado de placas, 60 min), tiempo por hoja rapidísimo + ruido
        tiempo_base = 60 + (cantidad * 0.005)
        
    elif tipo == 'Plotter':
        material = random.choice(materiales_plotter)
        cantidad = np.random.randint(1, 50)
        ancho = np.random.uniform(50.0, 300.0) # Formatos grandes (cm)
        alto = np.random.uniform(50.0, 500.0)
        # Lógica de tiempo: depende directamente del área a imprimir (ancho * alto)
        area_m2 = (ancho / 100) * (alto / 100)
        tiempo_base = 15 + (cantidad * area_m2 * 12) # 12 min por metro cuadrado
        
    else: # Serigrafía
        material = random.choice(materiales_serigrafia)
        cantidad = np.random.randint(50, 500)
        ancho, alto = 40.0, 50.0
        # Lógica de tiempo: setup medio (marcos), secado manual
        tiempo_base = 30 + (cantidad * 0.5)

    # 2. Agregar el "Ruido" o "Retrasos" del mundo real
    # Ninguna máquina es perfecta, añadimos minutos extra aleatorios (fallas, atascos, operador lento)
    ruido_operativo = np.random.normal(loc=15.0, scale=10.0) # Media de 15 min de retraso, varianza de 10
    
    tiempo_total_minutos = max(10, tiempo_base + ruido_operativo) # Asegurar que no haya tiempos negativos
    tiempo_total_minutos = round(tiempo_total_minutos, 2)

    # 3. Determinar si hubo un "retraso crítico" (para la clasificación de riesgo)
    # Asumimos que si el tiempo excede un 30% del tiempo base calculado, es un retraso
    es_retraso = 1 if tiempo_total_minutos > (tiempo_base * 1.30) else 0

    # Guardar la fila
    datos.append([tipo, material, cantidad, round(ancho, 2), round(alto, 2), tiempo_total_minutos, es_retraso])

# Convertir a DataFrame y guardar
columnas = ['tipo_impresion', 'material', 'cantidad', 'ancho_cm', 'alto_cm', 'tiempo_produccion_minutos', 'retraso_critico']
df = pd.DataFrame(datos, columns=columnas)

# Guardar en CSV y Excel
df.to_csv('historial_impresiones_24_meses.csv', index=False)
print("✅ Dataset generado en: scripts/historial_impresiones_24_meses.csv")

# df.to_excel('historial_impresiones_24_meses.xlsx', index=False) # Descomenta si prefieres Excel (requiere openpyxl)
print(f"✅ ¡Éxito! Dataset creado con {len(df)} registros.")
print("📊 Primeras 5 filas del dataset:")
print(df.head())