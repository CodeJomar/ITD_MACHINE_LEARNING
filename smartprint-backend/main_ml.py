import os
import sys

# Agregamos la ruta raíz al sistema para que encuentre los módulos correctamente
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '../../')))

# Importes del Objetivo 1 (Regresión de Tiempos)
from src.ml.generator import generar_dataset 
from src.ml.trainer import entrenar_modelo 

# Importes del Objetivo 2 (Clasificación de Riesgo)
from src.ml.generator_clasificacion import generar_dataset_riesgo
from src.ml.trainer_clasificacion import entrenar_modelo_riesgo

# Importaciones del Objetivo 3 (Inventario - Regresión Lineal)
from src.ml.generator_inventario import generar_dataset_inventario
from src.ml.trainer_inventario import entrenar_modelo_inventario

def mostrar_menu():
    print("\n" + "="*55)
    print(" 🚀 PANEL DE CONTROL DE MACHINE LEARNING - SMARTPRINT 🧠")
    print("="*55)
    print("--- OBJETIVO 1: TIEMPOS (Random Forest) ---")
    print("  1. Generar dataset de tiempos")
    print("  2. Entrenar modelo de tiempos (.pkl)")
    print("\n--- OBJETIVO 2: RIESGO (Regresión Logística) ---")
    print("  3. Generar dataset de riesgo de retrasos")
    print("  4. Entrenar modelo de riesgo (.pkl)")
    print("\n--- OBJETIVO 3: INVENTARIO (Regresión Lineal) ---")
    print("  5. Generar dataset de proyección de inventario")
    print("  6. Entrenar modelo de proyección de inventario (.pkl)")
    print("\n--- AUTOMATIZACIÓN ---")
    print("  7. 🚀 Ejecutar Pipeline Completo (Entrenar TODOS)")
    print("  0. Salir")
    print("="*55)

def main():
    while True:
        mostrar_menu()
        opcion = input("Selecciona una acción (0-7): ")

        try:
            if opcion == '1':
                print("\n[INFO] Construyendo historial de producción (Tiempos)...")
                generar_dataset()
            
            elif opcion == '2':
                print("\n[INFO] Entrenando Random Forest...")
                entrenar_modelo()
            
            elif opcion == '3':
                print("\n[INFO] Construyendo historial de retrasos (Riesgo)...")
                generar_dataset_riesgo()
            
            elif opcion == '4':
                print("\n[INFO] Entrenando Regresión Logística...")
                entrenar_modelo_riesgo()
            
            elif opcion == '5':
                print("\n[INFO] Construyendo historial de proyección de inventario...")
                generar_dataset_inventario()
            
            elif opcion == '6':
                print("\n[INFO] Entrenando Regresión Lineal...")
                entrenar_modelo_inventario()

            elif opcion == '7':
                print("\n[INFO] Iniciando Pipeline completo de Inteligencia Artificial...")
                print(">> 1/6: Generando datos de tiempos...")
                generar_dataset()
                print(">> 2/6: Entrenando modelo de tiempos...")
                entrenar_modelo()
                print(">> 3/6: Generando datos de riesgo...")
                generar_dataset_riesgo()
                print(">> 4/6: Entrenando modelo de riesgo...")
                entrenar_modelo_riesgo()
                print(">> 5/6: Generando datos de proyección de inventario...")
                generar_dataset_inventario()
                print(">> 6/6: Entrenando modelo de proyección de inventario...")
                entrenar_modelo_inventario()
                print("\n✅ ¡Todos los cerebros matemáticos (.pkl) han sido actualizados en src/models/!")
            
            elif opcion == '0':
                print("\nApagando panel de control ML... ¡Hasta pronto!")
                break
            
            else:
                print("\n⚠️ Opción no válida. Por favor, selecciona un número del 0 al 7.")
        
        except Exception as e:
            print(f"\n❌ Ocurrió un error en la ejecución: {e}")

if __name__ == "__main__":
    # Asegurarnos de que estamos parados en el directorio correcto antes de ejecutar
    os.makedirs(os.path.join(os.path.dirname(__file__), '../models'), exist_ok=True)
    main()