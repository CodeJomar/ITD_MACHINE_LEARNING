import { useState } from 'react';
import { Package, BookOpen, AlertTriangle, Plus, RefreshCw } from 'lucide-react';

// Componentes de shadcn/ui
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// ----------------------------------------------------------------------
// DATOS SIMULADOS (MOCK) - Estos vendrán de Supabase mediante FastAPI
// ----------------------------------------------------------------------
const mockMateriales = [
  { id: 1, nombre: 'Papel Couché 150g', stock_actual: 50000, unidad_medida: 'Pliegos', estado: 'ok' },
  { id: 2, nombre: 'Vinilo Adhesivo Brillo', stock_actual: 120, unidad_medida: 'Metros', estado: 'critico' },
  { id: 3, nombre: 'Lona Banner Mate 13oz', stock_actual: 800, unidad_medida: 'Metros', estado: 'ok' },
  { id: 4, nombre: 'Tinta Offset Cyan', stock_actual: 5, unidad_medida: 'Galones', estado: 'critico' },
];

const mockCatalogo = [
  { id: 1, nombre_impresion: 'Impresión Offset Masiva', material_id: 1, material_nombre: 'Papel Couché 150g', cantidad_base: 1000, tiempo_estandar: 45 },
  { id: 2, nombre_impresion: 'Digital Inmediata', material_id: 2, material_nombre: 'Vinilo Adhesivo Brillo', cantidad_base: 1, tiempo_estandar: 10 },
  { id: 3, nombre_impresion: 'Gigantografía', material_id: 3, material_nombre: 'Lona Banner Mate 13oz', cantidad_base: 1, tiempo_estandar: 30 },
];

export default function Inventario() {
  // Estados para los formularios
  const [insumoForm, setInsumoForm] = useState({ id: null, nombre: '', stock: '', unidad: '' });
  const [catalogForm, setCatalogForm] = useState({ id: null, nombre: '', materialId: '', cantidadBase: '', tiempoEstandar: '' });

  // Funciones para cargar datos a los formularios al hacer clic (Simula un "Editar")
  const cargarInsumo = (mat: any) => {
    setInsumoForm({ id: mat.id, nombre: mat.nombre, stock: mat.stock_actual.toString(), unidad: mat.unidad_medida });
  };

  const cargarCatalogo = (cat: any) => {
    setCatalogForm({ id: cat.id, nombre: cat.nombre_impresion, materialId: cat.material_id.toString(), cantidadBase: cat.cantidad_base.toString(), tiempoEstandar: cat.tiempo_estandar.toString() });
  };

  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-500 w-full">

      {/* Título de Sección */}
      <div>
        <h2 className="text-2xl font-bold text-slate-100 flex items-center gap-2">
          <Package className="text-cmykCyan h-6 w-6" /> Base de Datos y Parámetros
        </h2>
        <p className="text-sm text-slate-400 mt-1">
          Administre el inventario físico y configure las reglas matemáticas que alimentan la Inteligencia Artificial.
        </p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">

        {/* ==========================================
            COLUMNA IZQUIERDA: GESTIÓN DE INSUMOS
            ========================================== */}
        <div className="flex flex-col gap-6">

          {/* Formulario de Insumos */}
          <Card className="bg-slate-800 border-slate-700 shadow-sm p-4">
            <CardHeader className="border-b border-slate-700 pb-4 mb-4">
              <CardTitle className="text-lg text-cmykCyan flex items-center gap-2">
                {insumoForm.id ? <RefreshCw className="h-5 w-5" /> : <Plus className="h-5 w-5" />}
                {insumoForm.id ? 'Actualizar Insumo' : 'Nuevo Insumo'}
              </CardTitle>
              <CardDescription className="text-slate-400 text-xs">
                Guarda un producto al inventario actual.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold text-slate-400 uppercase">Nombre del Material</Label>
                  <Input
                    value={insumoForm.nombre}
                    onChange={e => setInsumoForm({ ...insumoForm, nombre: e.target.value })}
                    className="bg-slate-900 border-slate-700 text-slate-200 focus-visible:ring-cmykCyan rounded-xl px-4 py-5"
                    placeholder="Ej. Papel Couché 300g"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold text-slate-400 uppercase">Stock Físico</Label>
                    <Input
                      type="number"
                      value={insumoForm.stock}
                      onChange={e => setInsumoForm({ ...insumoForm, stock: e.target.value })}
                      className="bg-slate-900 border-slate-700 text-slate-200 focus-visible:ring-cmykCyan rounded-xl px-4 py-5"
                      placeholder="0"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold text-slate-400 uppercase">Unidad de Medida</Label>
                    <Input
                      value={insumoForm.unidad}
                      onChange={e => setInsumoForm({ ...insumoForm, unidad: e.target.value })}
                      className="bg-slate-900 border-slate-700 text-slate-200 focus-visible:ring-cmykCyan rounded-xl px-4 py-5"
                      placeholder="Ej. Millares"
                    />
                  </div>
                </div>
                <div className="mt-4 flex gap-3 pt-2">
                  <Button
                    className="flex-1 font-bold rounded-xl py-6 bg-cmykCyan text-slate-900 hover:bg-cmykCyan/90 border-0"
                  >
                    Guardar Insumo
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setInsumoForm({ id: null, nombre: '', stock: '', unidad: '' })}
                    className="border-slate-600 text-slate-400 hover:text-slate-200 hover:bg-slate-700 rounded-xl py-6"
                  >
                    Cancelar
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          {/* Lista de Insumos Actuales */}
          <Card className="bg-slate-800 border-slate-700 shadow-sm flex-1 p-4">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-bold text-slate-300 uppercase tracking-wider flex justify-between items-center">
                Materia Prima en Almacén
                <Badge variant="outline" className="border-slate-600 text-slate-400 font-normal">Clic para editar</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                {mockMateriales.map((mat) => (
                  <div
                    key={mat.id}
                    onClick={() => cargarInsumo(mat)}
                    className={`p-3 rounded-xl border cursor-pointer transition-all flex justify-between items-center bg-slate-900/50 hover:bg-slate-900
                      ${mat.estado === 'critico' ? 'border-red-500/50 hover:border-red-500 border-l-4 border-l-red-500' : 'border-slate-700 hover:border-cmykCyan'}`}
                  >
                    <div>
                      <p className="text-sm font-bold text-slate-200">{mat.nombre}</p>
                      <p className="text-xs text-slate-400 mt-1 flex items-center gap-1.5">
                        Stock: <span className={`font-bold ${mat.estado === 'critico' ? 'text-red-400' : 'text-slate-200'}`}>
                          {mat.stock_actual.toLocaleString()} {mat.unidad_medida}
                        </span>
                        {mat.estado === 'critico' && <AlertTriangle className="h-3 w-3 text-red-400" />}
                      </p>
                    </div>
                    <span className="text-[10px] uppercase font-bold bg-slate-800 text-slate-400 px-2 py-1 rounded border border-slate-700">ID: {mat.id}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

        </div>


        {/* ==========================================
            COLUMNA DERECHA: CATÁLOGO Y REGLAS ML
            ========================================== */}
        <div className="flex flex-col gap-6">

          {/* Formulario de Catálogo */}
          <Card className="bg-slate-800 border-slate-700 shadow-sm p-4">
            <CardHeader className="border-b border-slate-700 pb-4 mb-4">
              <CardTitle className="text-lg text-cmykMagenta flex items-center gap-2">
                <BookOpen className="h-5 w-5" /> Configuración de Reglas
              </CardTitle>
              <CardDescription className="text-slate-400 text-xs">
                Asocia un servicio con su insumo base para que el modelo calcule mermas y tiempos.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold text-slate-400 uppercase">Nombre del Servicio / Línea</Label>
                    <Input
                      value={catalogForm.nombre}
                      onChange={e => setCatalogForm({ ...catalogForm, nombre: e.target.value })}
                      className="bg-slate-900 border-slate-700 text-slate-200 focus-visible:ring-cmykMagenta rounded-xl px-4 py-5"
                      placeholder="Ej. Impresión Offset Masiva"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold text-slate-400 uppercase">Insumo Crítico Asociado</Label>
                    <Select value={catalogForm.materialId} onValueChange={(value) => setCatalogForm({ ...catalogForm, materialId: value ?? '' })}>
                      <SelectTrigger className="w-full bg-slate-900 border-slate-700 text-slate-200 focus:ring-cmykMagenta rounded-xl px-4 py-5">
                        <SelectValue placeholder="Vincular con materia prima..." />
                      </SelectTrigger>
                      <SelectContent
                        alignItemWithTrigger={false}
                        side="bottom"
                        sideOffset={8}
                        className="bg-slate-800 border border-white/10 text-slate-200 shadow-[0_18px_35px_-18px_rgba(255,255,255,0.35),0_0_0_1px_rgba(255,255,255,0.12)] ring-1 ring-white/15 rounded-xl z-50 min-w-[var(--anchor-width)]"
                      >
                        {mockMateriales.map(mat => (
                          <SelectItem key={mat.id} value={mat.id.toString()} className="focus:bg-slate-700 focus:text-slate-100 cursor-pointer py-2.5">
                            {mat.nombre} <span className="text-slate-500 ml-2">({mat.stock_actual} en stock)</span>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold text-slate-400 uppercase">Cantidad Base (Regla)</Label>
                    <Input
                      type="number"
                      value={catalogForm.cantidadBase}
                      onChange={e => setCatalogForm({ ...catalogForm, cantidadBase: e.target.value })}
                      className="bg-slate-900 border-slate-700 text-slate-200 focus-visible:ring-cmykMagenta rounded-xl px-4 py-5"
                      placeholder="Ej. 1000"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold text-slate-400 uppercase">Tiempo Base (Mins)</Label>
                    <Input
                      type="number"
                      value={catalogForm.tiempoEstandar}
                      onChange={e => setCatalogForm({ ...catalogForm, tiempoEstandar: e.target.value })}
                      className="bg-slate-900 border-slate-700 text-slate-200 focus-visible:ring-cmykMagenta rounded-xl px-4 py-5"
                      placeholder="Ej. 45"
                    />
                  </div>
                </div>

                <div className="mt-4 flex gap-3 pt-2">
                  <Button
                    className="flex-1 font-bold rounded-xl py-6 bg-cmykMagenta text-white hover:bg-cmykMagenta/90 border-0"
                  >
                    Guardar Regla
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setCatalogForm({ id: null, nombre: '', materialId: '', cantidadBase: '', tiempoEstandar: '' })}
                    className="border-slate-600 text-slate-400 hover:text-slate-200 hover:bg-slate-700 rounded-xl py-6"
                  >
                    Cancelar
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          {/* Lista de Catálogos Actuales */}
          <Card className="bg-slate-800 border-slate-700 shadow-sm flex-1 p-4">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-bold text-slate-300 uppercase tracking-wider flex justify-between items-center">
                Líneas de Producción
                <Badge variant="outline" className="border-slate-600 text-slate-400 font-normal">Clic para editar</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                {mockCatalogo.map((cat) => (
                  <div
                    key={cat.id}
                    onClick={() => cargarCatalogo(cat)}
                    className="p-3 bg-slate-900/50 rounded-xl border border-slate-700 hover:border-cmykMagenta cursor-pointer transition-all flex justify-between items-center hover:bg-slate-900"
                  >
                    <div>
                      <p className="text-sm font-bold text-slate-200">{cat.nombre_impresion}</p>
                      <p className="text-[11px] text-slate-400 mt-1">
                        Regla: Consume <span className="text-cmykCyan font-semibold">{cat.cantidad_base} unidad(es) de {cat.material_nombre}</span>.
                      </p>
                      <p className="text-[11px] text-slate-400">
                        Tiempo Estandar: <span className="text-cmykYellow font-semibold">{cat.tiempo_estandar} min</span>
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

        </div>
      </div>
    </div>
  );
}