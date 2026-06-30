import uvicorn

if __name__ == "__main__":
    print("\n" + "="*50)
    print(" 🟢 INICIANDO ARQUITECTURA WEB DE SMARTPRINT MVP")
    print("="*50)
    print("Servidor local corriendo en: http://localhost:8000")
    print("Swagger UI interactivo en:   http://localhost:8000/docs")
    print("="*50 + "\n")
    
    uvicorn.run("src.app.main:app", host="0.0.0.0", port=8000, reload=True)