import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export function useInventario() {
  // 1. Estados de los datos
  const [materiales, setMateriales] = useState<any[]>([]);
  const [catalogo, setCatalogo] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // 2. Estados de los formularios
  const [insumoForm, setInsumoForm] = useState({ id: null, nombre: '', stock: '', unidad: '' });
  const [catalogForm, setCatalogForm] = useState({ id: null, nombre: '', materialId: '', cantidadBase: '', tiempoEstandar: '' });

  // 3. Efecto de carga inicial
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const { data: dataMateriales, error: errMat } = await supabase
        .from('mermas_materiales')
        .select('*')
        .order('id', { ascending: true });

      if (errMat) console.error("Error cargando materiales:", errMat);
      else setMateriales(dataMateriales || []);

      const { data: dataCatalogo, error: errCat } = await supabase
        .from('catalogo_impresion')
        .select('*, mermas_materiales(nombre)')
        .order('id', { ascending: true });

      if (errCat) console.error("Error cargando catálogo:", errCat);
      else setCatalogo(dataCatalogo || []);

    } catch (error) {
      console.error("Error en conexión:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // 4. Funciones de guardado
  const guardarInsumo = async (e: React.FormEvent) => {
    e.preventDefault();
    const estadoCalculado = Number(insumoForm.stock) < 100 ? 'critico' : 'ok';
    const payload = {
      nombre: insumoForm.nombre,
      stock_actual: Number(insumoForm.stock),
      unidad_medida: insumoForm.unidad,
      estado: estadoCalculado
    };

    if (insumoForm.id) await supabase.from('mermas_materiales').update(payload).eq('id', insumoForm.id);
    else await supabase.from('mermas_materiales').insert([payload]);

    setInsumoForm({ id: null, nombre: '', stock: '', unidad: '' });
    fetchData();
  };

  const guardarReglaCatalogo = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      nombre_impresion: catalogForm.nombre,
      material_id: Number(catalogForm.materialId),
      cantidad_base: Number(catalogForm.cantidadBase),
      tiempo_estandar: Number(catalogForm.tiempoEstandar)
    };

    if (catalogForm.id) await supabase.from('catalogo_impresion').update(payload).eq('id', catalogForm.id);
    else await supabase.from('catalogo_impresion').insert([payload]);

    setCatalogForm({ id: null, nombre: '', materialId: '', cantidadBase: '', tiempoEstandar: '' });
    fetchData();
  };

  // 5. Funciones de carga para edición
  const cargarInsumo = (mat: any) => setInsumoForm({ id: mat.id, nombre: mat.nombre, stock: mat.stock_actual.toString(), unidad: mat.unidad_medida });
  const cargarCatalogo = (cat: any) => setCatalogForm({ id: cat.id, nombre: cat.nombre_impresion, materialId: cat.material_id.toString(), cantidadBase: cat.cantidad_base.toString(), tiempoEstandar: cat.tiempo_estandar.toString() });

  // 6. Retornamos todo lo que la UI va a necesitar
  return {
    materiales,
    catalogo,
    isLoading,
    insumoForm,
    setInsumoForm,
    catalogForm,
    setCatalogForm,
    guardarInsumo,
    guardarReglaCatalogo,
    cargarInsumo,
    cargarCatalogo
  };
}