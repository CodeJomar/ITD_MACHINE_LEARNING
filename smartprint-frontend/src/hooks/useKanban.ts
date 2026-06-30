import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

// Tipado de la tarea tal como la necesita el componente Kanban
type EstadoTarea = 'pendiente' | 'impresion' | 'finalizado';

export interface Tarea {
  id: string;
  dbId: number;
  cliente: string;
  tipo: string;
  cantidad: string;
  estado: EstadoTarea;
}

// Mapa de estados BD → Kanban
const mapEstadoBD = (estado: string): EstadoTarea => {
  const mapa: Record<string, EstadoTarea> = {
    'PENDIENTE':   'pendiente',
    'PRE_PRENSA':  'pendiente',
    'IMPRESION':   'impresion',
    'POST_PRENSA': 'finalizado',
    'FINALIZADO':  'finalizado'
  };
  return mapa[estado] || 'pendiente';
};

// Mapa inverso Kanban → BD
const mapEstadoKanban = (estado: EstadoTarea): string => {
  const mapa: Record<EstadoTarea, string> = {
    'pendiente':  'PENDIENTE',
    'impresion':  'IMPRESION',
    'finalizado': 'FINALIZADO'
  };
  return mapa[estado];
};

export function useKanban() {
  const [tareas, setTareas] = useState<Tarea[]>([]);

  // Carga inicial desde Supabase
  useEffect(() => {
    fetchTareas();
  }, []);

  const fetchTareas = async () => {
    const { data } = await supabase
      .from('colas_produccion')
      .select('*, catalogo_impresion(nombre_impresion)')
      .order('id', { ascending: false });

    if (data) {
      setTareas(data.map(p => ({
        id: `#${p.id}`,
        dbId: p.id,
        cliente: p.cliente_name,
        tipo: p.catalogo_impresion?.nombre_impresion || 'Impresión',
        cantidad: `${p.cantidad_tiraje.toLocaleString()} unidades`,
        estado: mapEstadoBD(p.estado_proceso)
      })));
    }
  };

  // Mueve una tarjeta de columna y persiste el cambio en Supabase
  const moverTarea = async (id: string, nuevoEstado: EstadoTarea, mermaReal?: number) => {
    const tarea = tareas.find(t => t.id === id);
    if (!tarea) return;

    // Actualizar en Supabase
    const payload: any = { estado_proceso: mapEstadoKanban(nuevoEstado) };

    // Si entra a máquina, guardamos la hora de inicio localmente
    if (nuevoEstado === 'impresion') {
      localStorage.setItem(`inicio_impresion_${tarea.dbId}`, Date.now().toString());
    }

    // Si finaliza, calculamos el tiempo y agregamos la merma
    if (mermaReal !== undefined && nuevoEstado === 'finalizado') {
      payload.merma_real_unidades = mermaReal;

      const inicioStr = localStorage.getItem(`inicio_impresion_${tarea.dbId}`);
      if (inicioStr) {
        const inicio = parseInt(inicioStr, 10);
        const minutosTranscurridos = Math.round((Date.now() - inicio) / 60000); // Milisegundos a Minutos
        // Si fue muy rápido (menos de 1 minuto), guardamos 1 min para que no quede en 0
        payload.tiempo_real_minutos = Math.max(1, minutosTranscurridos);
        localStorage.removeItem(`inicio_impresion_${tarea.dbId}`);
      }
    }

    await supabase
      .from('colas_produccion')
      .update(payload)
      .eq('id', tarea.dbId);

    // Actualizar estado local
    setTareas(tareas.map(t =>
      t.id === id ? { ...t, estado: nuevoEstado } : t
    ));
  };

  // Filtros por columna
  const pendientes  = tareas.filter(t => t.estado === 'pendiente');
  const enImpresion = tareas.filter(t => t.estado === 'impresion');
  const todosFinalizados = tareas.filter(t => t.estado === 'finalizado');

  // Solo mostramos los últimos 5 finalizados para que el board no crezca infinito
  const finalizadosVisibles = todosFinalizados.slice(0, 5);
  const totalFinalizados = todosFinalizados.length;

  return { tareas, moverTarea, pendientes, enImpresion, finalizadosVisibles, totalFinalizados };
}
