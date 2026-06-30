import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export function useDashboard() {
  const [materiales, setMateriales] = useState<any[]>([]);
  const [catalogo, setCatalogo] = useState<any[]>([]);
  const [isPredicting, setIsPredicting] = useState(false);
  const [prediccionMinutos, setPrediccionMinutos] = useState<number | null>(null);

  // KPIs dinámicos calculados desde la BD
  const [kpiPedidosHoy, setKpiPedidosHoy] = useState(0);
  const [kpiEnCola, setKpiEnCola] = useState(0);
  const [kpiTerminados, setKpiTerminados] = useState(0);

  // Estados para la cola y el gráfico
  const [colaPedidos, setColaPedidos] = useState<any[]>([]);
  const [chartData, setChartData] = useState<any[]>([]);

  // Estados del Formulario
  const [ordenForm, setOrdenForm] = useState({
    cliente: '',
    catalogoId: '',
    materialId: '',
    cantidad: '',
    ancho: '',
    alto: ''
  });

  const fetchData = async () => {
    // 1. Traer listas para los Selects (Ajustado a tus nombres de tablas reales)
    const { data: dataMat } = await supabase.from('mermas_materiales').select('*');
    const { data: dataCat } = await supabase.from('catalogo_impresion').select('*');

    if (dataMat) setMateriales(dataMat);
    if (dataCat) setCatalogo(dataCat);

    // 2. Traer la Cola de Pedidos Reales
    const { data: dataColas } = await supabase
      .from('colas_produccion')
      .select('*, catalogo_impresion(nombre_impresion)')
      .order('id', { ascending: false });

    if (dataColas) {
      // 3. Calcular KPIs dinámicos desde los datos reales
      const hoy = new Date().toISOString().slice(0, 10);
      setKpiPedidosHoy(dataColas.filter(p => p.created_at?.slice(0, 10) === hoy).length);
      setKpiEnCola(dataColas.filter(p => ['PENDIENTE', 'PRE_PRENSA', 'IMPRESION'].includes(p.estado_proceso)).length);
      setKpiTerminados(dataColas.filter(p => p.estado_proceso === 'FINALIZADO').length);

      // 4. Solo mostramos pedidos activos/próximos en las tarjetas del Dashboard
      const pedidosActivos = dataColas
        .filter(pedido => ['PENDIENTE', 'PRE_PRENSA'].includes(pedido.estado_proceso))
        .map(pedido => ({
          id: `#${pedido.id}`,
          cliente: pedido.cliente_name,
          tipo: pedido.catalogo_impresion?.nombre_impresion || 'Impresión',
          cantidad: pedido.cantidad_tiraje,
          ancho: pedido.ancho_cm,
          alto: pedido.alto_cm,
          tiempoEstimado: `${pedido.tiempo_estimado_minutos} min`,
          merma: `${pedido.merma_estimada_unidades} und`,
          estado: pedido.estado_proceso
        }));
      setColaPedidos(pedidosActivos);

      // 5. Alimentar el Gráfico solo con los pedidos en MÁQUINA (IMPRESIÓN)
      const enMaquina = dataColas.filter(pedido => pedido.estado_proceso === 'IMPRESION');
      const chartFormat = enMaquina.slice(0, 5).reverse().map(pedido => ({
        name: `Ped #${pedido.id}`,
        Tiempo: pedido.tiempo_estimado_minutos
      }));
      setChartData(chartFormat);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const procesarPedido = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsPredicting(true);

    try {
      // 1. Obtener la data real asociada al tipo de impresión seleccionado
      const tipoCatalogo = catalogo.find(c => c.id.toString() === ordenForm.catalogoId);
      const realMaterialId = tipoCatalogo ? tipoCatalogo.material_id : null;
      
      const tipoMaterial = materiales.find(m => m.id === realMaterialId);
      const nombreCatalogo = tipoCatalogo ? tipoCatalogo.nombre_impresion : "Desconocido";
      const nombreMaterial = tipoMaterial ? tipoMaterial.nombre : "Desconocido";

      // A. Llamada a la IA (FastAPI) con los nombres de texto correctos
      const iaResponse = await fetch('http://localhost:8000/api/predecir-tiempo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tipo_impresion: nombreCatalogo,
          ancho_cm: Number(ordenForm.ancho),
          alto_cm: Number(ordenForm.alto),
          cantidad: Number(ordenForm.cantidad),
          material: nombreMaterial
        })
      });

      const iaResult = await iaResponse.json();
      const tiempoEstimado = Math.round(iaResult.tiempo_estimado_minutos);
      const mermaEstimada = Math.round(iaResult.merma_estimada_unidades || Math.floor(Number(ordenForm.cantidad) * 0.05));

      setPrediccionMinutos(tiempoEstimado);

      const fechaActual = new Date();
      const fechaCompromiso = new Date(fechaActual.getTime() + tiempoEstimado * 60000).toISOString();

      // B. Guardar en Supabase
      const { error: dbError } = await supabase.from('colas_produccion').insert([{
        cliente_name: ordenForm.cliente,
        catalogo_id: Number(ordenForm.catalogoId),
        material_id: realMaterialId,
        cantidad_tiraje: Number(ordenForm.cantidad),
        ancho_cm: Number(ordenForm.ancho),
        alto_cm: Number(ordenForm.alto),
        tiempo_estimado_minutos: tiempoEstimado,
        merma_estimada_unidades: mermaEstimada,
        fecha_compromiso: fechaCompromiso,
        estado_proceso: 'PENDIENTE'
      }]);

      if (dbError) {
        console.error("Error al guardar en Supabase:", dbError);
        throw new Error("No se pudo guardar el pedido en la BD (verifica consola).");
      }

      alert(`¡Pedido procesado! Tiempo: ${tiempoEstimado} mins | Merma est: ${mermaEstimada} unds.`);

      setOrdenForm({ cliente: '', catalogoId: '', materialId: '', cantidad: '', ancho: '', alto: '' });
      fetchData(); // Recargamos la tabla automáticamente

    } catch (error: any) {
      console.error("Error:", error);
      alert(error.message || "Error al conectar con la IA o BD.");
    } finally {
      setIsPredicting(false);
    }
  };

  return {
    materiales, catalogo, ordenForm, setOrdenForm,
    isPredicting, prediccionMinutos, procesarPedido,
    colaPedidos, chartData,
    kpiPedidosHoy, kpiEnCola, kpiTerminados
  };
}