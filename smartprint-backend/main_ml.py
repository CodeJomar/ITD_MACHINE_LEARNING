from src.ml.generator import generar_dataset
from src.ml.trainer import entrenar_modelo

def menu():
    while True:
        print("\n" + "="*50)
        print(" 🤖 PANEL DE CONTROL: MACHINE LEARNING SMARTPRINT")
        print("="*50)
        print("1. Generar nuevo Dataset (Historial 24 meses)")
        print("2. Entrenar Modelo Random Forest")
        print("3. Ejecutar Pipeline Completo (1 y 2)")
        print("4. Salir")
        print("="*50)

        opcion = input("Elige una opción (1-4): ")

        if opcion == '1':
            generar_dataset()
        elif opcion == '2':
            entrenar_modelo()
        elif opcion == '3':
            generar_dataset()
            entrenar_modelo()
        elif opcion == '4':
            print("👋 Saliendo del panel...")
            break
        else:
            print("❌ Opción no válida. Intenta de nuevo.")

if __name__ == "__main__":
    menu()