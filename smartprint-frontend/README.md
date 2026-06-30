# SmartPrint MVP - Frontend (Dashboard de Gestión de Imprenta)

## 🎨 Descripción del Proyecto

El frontend de **SmartPrint** actúa como el "panel de mando" operativo de la imprenta. Es una aplicación de una sola página (SPA) desarrollada con **React** y **Vite**, diseñada para ofrecer una experiencia de usuario rápida, fluida y altamente profesional.

Esta interfaz no solo permite la gestión de inventario y pedidos, sino que sirve como el punto de interacción final donde se consume nuestra Inteligencia Artificial (microservicio FastAPI) para la predicción de tiempos de producción y donde se visualizan los procesos en tiempo real mediante un monitor Kanban.

## 🏗️ Filosofía de Arquitectura: "Separation of Concerns"

Para garantizar un código mantenible, escalable y limpio, hemos adoptado una arquitectura profesional basada en dos pilares:

1. **Componentes "Tontos" (Presentacionales):** Los archivos en `src/components/` se encargan exclusivamente de la estructura visual, estilos de Tailwind y la disposición de los elementos. No contienen lógica de negocio compleja.
2. **Hooks Personalizados (El "Cerebro"):** Toda la lógica de TypeScript, conexiones a Supabase y llamadas a la API de Inteligencia Artificial reside en `src/hooks/`. Esto permite que el diseño sea independiente de la implementación de datos, evitando el retrabajo y facilitando las pruebas.

## 🛠️ Tecnologías Principales

- **React + Vite**: Para una experiencia de desarrollo ultra rápida y un bundle optimizado.
- **TypeScript**: Tipado estático para evitar errores en tiempo de ejecución.
- **Tailwind CSS + Shadcn/UI**: Para un diseño industrial, moderno y consistente.
- **Supabase (SDK)**: Integración nativa como Backend-as-a-Service para la persistencia de datos.
- **Lucide React**: Biblioteca de iconos de alta calidad.

## 📂 Estructura del Proyecto

```text
src/
├── components/           # UI Components (Dashboard, Kanban, Inventario)
├── hooks/                # Lógica de negocio (useDashboard, useInventario)
├── lib/                  # Configuración de clientes (supabase.ts)
├── types/                # Definiciones de interfaces
└── App.tsx               # Orquestador principal
```

## 🔌 Integraciones Clave

Este frontend mantiene "dos tuberías" abiertas para su funcionamiento correcto:

- **Supabase (Base de Datos)**: Conectada mediante `src/lib/supabase.ts`. Gestiona el CRUD completo de materiales, servicios y pedidos persistentes en la nube.
- **FastAPI (IA Microservice)**: El Dashboard realiza peticiones `fetch` hacia el endpoint `/api/predecir-tiempo` (local o remoto). El Frontend envía los parámetros de un pedido nuevo, recibe la estimación de tiempo (vía Random Forest) y guarda el resultado final en la base de datos.

## 🚀 Configuración Inicial

### 1. Variables de Entorno

Crea un archivo `.env` en la raíz de tu proyecto (junto a `package.json`) y configura las credenciales de tu proyecto de Supabase:

```env
VITE_SUPABASE_URL="TU_URL_DE_SUPABASE"
VITE_SUPABASE_ANON_KEY="TU_KEY_DE_SUPABASE"
```

### 2. Instalación

Ejecuta en la terminal:

```bash
# Instalar dependencias
npm install

# Iniciar el servidor de desarrollo
npm run dev
```

## 💡 Guía de Desarrollo para nuevos integrantes

- **Si quieres modificar el diseño**: Ve directamente a los componentes en `src/components/custom/`.
- **Si quieres cambiar la lógica de datos**: No toques el componente; edita el Hook correspondiente en `src/hooks/` (ej. `useDashboard.ts`).
- **Estilos**: Utilizamos clases de utilidad de Tailwind. Los colores de la interfaz siguen una paleta industrial (`cmykCyan`, `cmykYellow`, `cmykMagenta`) sobre un fondo oscuro (`bg-slate-900`).