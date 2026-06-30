# SmartPrint: Ecosistema de Gestión e Inteligencia Operativa

## 1. Visión Ejecutiva

SmartPrint es una plataforma de Transformación Digital diseñada específicamente para la modernización de imprentas de mediana escala. El proyecto aborda la ineficiencia operativa tradicional, caracterizada por la dependencia de procesos manuales, falta de trazabilidad y la gestión basada en conocimiento tácito no documentado.

Nuestra solución integra Inteligencia Artificial (IA), Cloud Computing y Sistemas de Visualización Kanban para transformar datos históricos en predicciones exactas de tiempos de producción, optimizando así la rentabilidad, los plazos de entrega y la moral operativa del equipo.

## 2. Definición del Problema y Oportunidad

La imprenta "Impresiones y Soluciones Gráficas S.A.C." enfrenta tres retos críticos:

- **Incertidumbre en la Planificación:** Los tiempos de entrega son estimados "a ojo", lo que genera cuellos de botella.
- **Desorden Operativo:** La falta de una base de datos centralizada obliga a depender de pizarras físicas y memoria humana.
- **Escalabilidad Limitada:** Al no existir una base de datos histórica, la empresa pierde oportunidades de mejora continua (Data-Driven Decision Making).

SmartPrint actúa como el puente que digitaliza estos procesos, convirtiendo la gestión manual en un flujo de trabajo auditable, predecible y escalable.

## 3. Arquitectura del Ecosistema (High-Level Design)

El sistema está construido bajo una arquitectura desacoplada y modular, lo que garantiza que el núcleo predictivo (IA) y la gestión de datos (BaaS) puedan evolucionar independientemente.

- **Capa de Inteligencia (Microservicio):** Desarrollada en FastAPI. Aloja el motor de Machine Learning que realiza la inferencia predictiva mediante modelos serializados de Random Forest Regressor.
- **Capa de Persistencia (Backend as a Service):** Supabase (PostgreSQL). Almacena el inventario, el catálogo de servicios y, crucialmente, la cola de producción, permitiendo que la interfaz y el servidor de IA se sincronicen en tiempo real.
- **Capa de Interacción (Frontend):** React + Vite. Proporciona un Dashboard industrial de alto rendimiento, conectando al usuario final con la lógica de negocio y la IA.

## 4. Flujo de Trabajo (Workflow Lógico)

El sistema opera mediante una secuencia cerrada de pasos diseñada para minimizar el error humano:

1. **Ingreso del Pedido:** El operario registra un nuevo servicio (tipo, material, tiraje, dimensiones) en el Dashboard.
2. **Consulta de IA:** El frontend envía los parámetros a nuestro microservicio FastAPI. El modelo, pre-entrenado con un histórico de 24 meses, realiza una predicción (inferencia) y devuelve los minutos estimados de producción.
3. **Persistencia:** El sistema registra el pedido en la base de datos de Supabase, asignándole automáticamente un estado inicial en el Kanban.
4. **Monitoreo Kanban:** La interfaz actualiza el estado del pedido en tiempo real (Pendiente, En Prensa, Post-Prensa, Finalizado), permitiendo una gestión visual del taller.

## 5. Estrategia de Machine Learning

El núcleo de la innovación de SmartPrint es su capacidad predictiva.

- **Pre-procesamiento:** Implementamos Feature Engineering para convertir variables cualitativas (tipo de papel, técnica) en vectores binarios (One-Hot Encoding) y aplicamos escalado (StandardScaler) a las variables cuantitativas para asegurar la precisión del modelo.
- **Entrenamiento:** Se utiliza un algoritmo de Random Forest Regressor, seleccionado por su robustez ante relaciones no lineales entre los parámetros de impresión y el tiempo final.
- **Pipeline de Producción:** El modelo no se reentrena en cada petición. Se entrena, se serializa en un archivo `.pkl` (binario) y se carga en memoria en el servidor, permitiendo una latencia de respuesta de milisegundos.

## 6. Roadmap y Escalabilidad

Esta arquitectura ha sido diseñada con visión de futuro:

- **Fase Actual (MVP):** Automatización interna y control predictivo.
- **Fase 2 (Escalabilidad):** Integración con un portal de auto-atención para clientes finales. Esto permitirá que los clientes suban sus diseños y reciban cotizaciones (incluyendo tiempos estimados) sin interacción humana, cargando directamente la cola de producción.
- **Fase 3 (Pagos y Logística):** Integración de pasarelas de pago y módulos de despacho automatizado para cerrar el ciclo completo de venta.

## 7. Filosofía de Desarrollo

El proyecto SmartPrint se adhiere a las mejores prácticas de Ingeniería de Software de Nivel Senior:

- **Separación de Responsabilidades:** No mezclamos la lógica de la base de datos con la lógica de la IA.
- **Diseño centrado en el usuario:** El Dashboard es industrial, oscuro (reducir fatiga visual) y denso en información, diseñado para operarios en un entorno real.
- **Despliegue ágil:** Los componentes están aislados (Frontend, Backend, Database), lo que facilita su despliegue en entornos de nube modernos.