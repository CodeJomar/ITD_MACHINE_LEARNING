-- ELIMINAMOS LAS TABLAS ANTERIORES PARA RECREARLAS CON LOS EXTRAS (Solo para entorno de desarrollo)
DROP TABLE IF EXISTS colas_produccion;
DROP TABLE IF EXISTS catalogo_impresion;
DROP TABLE IF EXISTS mermas_materiales;

-- 1. Tabla de Materiales / Insumos (Soporta Creación de Stock)
CREATE TABLE mermas_materiales (
    id BIGSERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    stock_actual INT NOT NULL DEFAULT 0,
    unidad_medida VARCHAR(20) NOT NULL, -- Ej: 'Hojas', 'Metros', 'Unidades'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Tabla de Servicios (Soporta Creación de Catálogo)
CREATE TABLE catalogo_impresion (
    id BIGSERIAL PRIMARY KEY,
    nombre_impresion VARCHAR(100) NOT NULL, 
    material_id INT REFERENCES mermas_materiales(id) ON DELETE SET NULL,
    cantidad_base_regla INT NOT NULL DEFAULT 1,
    tiempo_estandar_minutos INT NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Tabla de Pedidos e IA (Soporta Creación de Pedidos + EXTRAS DE PRODUCTO)
CREATE TABLE colas_produccion (
    id BIGSERIAL PRIMARY KEY,
    cliente_name VARCHAR(150) NOT NULL,
    catalogo_id INT REFERENCES catalogo_impresion(id),
    material_id INT REFERENCES mermas_materiales(id),
    
    -- Variables de entrada (Features para el modelo .pkl)
    cantidad_tiraje INT NOT NULL,
    ancho_cm NUMERIC(6,2) NOT NULL,
    alto_cm NUMERIC(6,2) NOT NULL,
    
    -- [EXTRA 1] Métricas de Tiempo: Predicción vs Realidad
    tiempo_estimado_minutos INT DEFAULT 0,  -- Lo que dice tu modelo Random Forest
    tiempo_real_minutos INT DEFAULT NULL,    -- Lo que realmente tardó (se llena al finalizar en el Kanban)
    
    -- [EXTRA 2] Métricas de Merma/Desperdicio (Core de SmartPrint)
    merma_estimada_unidades INT DEFAULT 0,  -- Predicción de hojas/metros que se van a desperdiciar
    merma_real_unidades INT DEFAULT NULL,    -- Lo que el operario reportó que se botó a la basura
    
    -- Estado para el Monitor Kanban
    estado_proceso VARCHAR(30) NOT NULL DEFAULT 'PENDIENTE', 
    -- 'PENDIENTE', 'PRE_PRENSA', 'IMPRESION', 'POST_PRENSA', 'FINALIZADO'
    
    -- [EXTRA 3] Fechas de control de rendimiento (KPIs de producción)
    fecha_compromiso TIMESTAMP WITH TIME ZONE DEFAULT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);