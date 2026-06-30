import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export function useDashboard() {
  const [materiales, setMateriales] = useState<any[]>([]);
  const [catalogo, setCatalogo] = useState<any[]>([]);
  const [isPredicting, setIsPredicting] = useState(false);
  const [prediccionMinutos, setPrediccionMinutos] = useState<number | null>(null);

  // NUEVO: Estados para reemplazar tus mocks
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
      // Mapeamos los datos reales para que encajen perfecto en tu diseño
      const pedidosFormateados = dataColas.map(pedido => ({
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
      setColaPedidos(pedidosFormateados);

      // 3. Alimentar el Gráfico de Recharts (Ej: Mostramos los últimos 5 tiempos)
      const chartFormat = dataColas.slice(0, 5).reverse().map(pedido => ({
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
      // A. Llamada a la IA (FastAPI)
      const iaResponse = await fetch('http://localhost:8000/api/predecir', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tipo_impresion: ordenForm.catalogoId,
          tamaño_ancho: Number(ordenForm.ancho),
          tamaño_alto: Number(ordenForm.alto),
          cantidad: Number(ordenForm.cantidad),
          tipo_material: ordenForm.materialId
        })
      });

      const iaResult = await iaResponse.json();
      const tiempoEstimado = iaResult.tiempo_estimado_minutos;
      // Supongamos que tu IA también devuelve merma (ajusta esto si tu API devuelve un campo diferente)
      const mermaEstimada = iaResult.merma_estimada_unidades || Math.floor(Number(ordenForm.cantidad) * 0.05);

      setPrediccionMinutos(tiempoEstimado);

      // B. Guardar en Supabase
      await supabase.from('colas_produccion').insert([{
        cliente_name: ordenForm.cliente,
        catalogo_id: Number(ordenForm.catalogoId),
        material_id: Number(ordenForm.materialId),
        cantidad_tiraje: Number(ordenForm.cantidad),
        ancho_cm: Number(ordenForm.ancho),
        alto_cm: Number(ordenForm.alto),
        tiempo_estimado_minutos: tiempoEstimado,
        merma_estimada_unidades: mermaEstimada,
        estado_proceso: 'PENDIENTE'
      }]);

      alert(`¡Pedido procesado! Tiempo: ${tiempoEstimado} mins | Merma est: ${mermaEstimada} unds.`);

      setOrdenForm({ cliente: '', catalogoId: '', materialId: '', cantidad: '', ancho: '', alto: '' });
      fetchData(); // Recargamos la tabla automáticamente

    } catch (error) {
      console.error("Error:", error);
      alert("Error al conectar con la IA o BD.");
    } finally {
      setIsPredicting(false);
    }
  };

  return {
    materiales, catalogo, ordenForm, setOrdenForm,
    isPredicting, prediccionMinutos, procesarPedido,
    colaPedidos, chartData
  };
}