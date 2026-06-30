import { BookOpen } from 'lucide-react';
import { useInventario } from '@/hooks/useInventario';

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

export default function Catalogo() {
  const {
    materiales, catalogo, catalogForm, setCatalogForm,
    guardarReglaCatalogo, cargarCatalogo
  } = useInventario();

  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-500 w-full">

      {/* Título de Sección */}
      <div>
        <h2 className="text-2xl font-bold text-slate-100 flex items-center gap-2">
          <BookOpen className="text-cmykMagenta h-6 w-6" /> Reglas de Catálogo
        </h2>
        <p className="text-sm text-slate-400 mt-1">
          Configure las reglas matemáticas y de tiempos que alimentan la Inteligencia Artificial.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

        {/* COLUMNA 1: FORMULARIO (RESTALURADO AL DISEÑO ORIGINAL) */}
        <div>
          <Card className="bg-slate-800 border-slate-700 shadow-sm sticky top-0 p-4">
            <CardHeader className="border-b border-slate-700 pb-4 mb-4">
              <CardTitle className="text-lg text-cmykMagenta flex items-center gap-2">
                <BookOpen className="h-5 w-5" /> Configuración de Reglas
              </CardTitle>
              <CardDescription className="text-slate-400 text-xs">
                Asocia un servicio con su insumo base para que el modelo calcule mermas y tiempos.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form className="space-y-4" onSubmit={guardarReglaCatalogo}>

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
                        <SelectValue placeholder="Vincular con materia prima...">
                          {materiales.find(m => m.id.toString() === catalogForm.materialId)?.nombre || "Vincular con materia prima..."}
                        </SelectValue>
                      </SelectTrigger>
                      <SelectContent
                        alignItemWithTrigger={false}
                        side="bottom"
                        sideOffset={8}
                        className="bg-slate-800 border border-white/10 text-slate-200 shadow-[0_18px_35px_-18px_rgba(255,255,255,0.35),0_0_0_1px_rgba(255,255,255,0.12)] ring-1 ring-white/15 rounded-xl z-50 min-w-[var(--anchor-width)]"
                      >
                        {materiales.map(mat => (
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
                  <Button type="submit" className="flex-1 font-bold rounded-xl py-6 bg-cmykMagenta text-white hover:bg-cmykMagenta/90 border-0">
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
        </div>

        {/* COLUMNA 2: LISTADO */}
        <div className="flex flex-col">
          <Card className="bg-slate-800 border-slate-700 shadow-sm flex-1 flex flex-col p-4">
            <CardHeader className="pb-3 border-b border-slate-700 mb-2">
              <CardTitle className="text-sm font-bold text-slate-300 uppercase tracking-wider flex justify-between items-center">
                Líneas de Producción
                <Badge variant="outline" className="border-slate-600 text-slate-400 font-normal">Clic para editar</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="flex-1 p-0 px-4 pb-4">
              <div className="space-y-2 max-h-[65vh] overflow-y-auto pr-2 custom-scrollbar">
                {catalogo.map((cat) => (
                  <div
                    key={cat.id}
                    onClick={() => cargarCatalogo(cat)}
                    className="p-3 bg-slate-900/50 rounded-xl border border-slate-700 hover:border-cmykMagenta cursor-pointer transition-all flex justify-between items-center hover:bg-slate-900"
                  >
                    <div>
                      <p className="text-sm font-bold text-slate-200">{cat.nombre_impresion}</p>
                      <p className="text-[11px] text-slate-400 mt-1">
                        Regla: Consume <span className="text-cmykCyan font-semibold">{cat.cantidad_base_regla} unidad(es) de {cat.mermas_materiales?.nombre || 'N/A'}</span>.
                      </p>
                      <p className="text-[11px] text-slate-400">
                        Tiempo Estandar: <span className="text-cmykYellow font-semibold">{cat.tiempo_estandar_minutos} min</span>
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