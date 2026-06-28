export interface Material {
  id: number;
  nombre: string;
  stock_actual: number;
  unidad_medida: string;
}

export interface Catalogo {
  id: number;
  nombre_impresion: string;
  material_id: number;
  cantidad_base_regla: number;
  tiempo_estandar_minutos: number;
}

export interface OrdenProduccion {
  id: number;
  cliente_name: string;
  catalogo_id: number;
  material_id: number;
  cantidad_tiraje: number;
  ancho_cm: number;
  alto_cm: number;
  tiempo_estimado_minutos: number;
  tiempo_real_minutos: number | null;
  estado_proceso: string;
}