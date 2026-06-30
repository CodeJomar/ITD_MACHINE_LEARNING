import { Package, AlertTriangle, Plus, RefreshCw } from 'lucide-react';
import { useInventario } from '@/hooks/useInventario';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";

export default function Inventario() {
  const {
    materiales, insumoForm, setInsumoForm,
    guardarInsumo, cargarInsumo
  } = useInventario();

  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-500 w-full">

      <div>
        <h2 className="text-2xl font-bold text-slate-100 flex items-center gap-2">
          <Package className="text-cmykCyan h-6 w-6" /> Gestión de Inventario
        </h2>
        <p className="text-sm text-slate-400 mt-1">
          Administre el inventario físico de materia prima en el almacén.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

        {/* COLUMNA 1: FORMULARIO */}
        <div>
          <Card className="bg-slate-800 border-slate-700 shadow-sm sticky top-0 p-4">
            <CardHeader className="border-b border-slate-700 pb-4 mb-4">
              <CardTitle className="text-lg text-cmykCyan flex items-center gap-2">
                {insumoForm.id ? <RefreshCw className="h-5 w-5" /> : <Plus className="h-5 w-5" />}
                {insumoForm.id ? 'Actualizar Insumo' : 'Nuevo Insumo'}
              </CardTitle>
              <CardDescription className="text-slate-400 text-xs">
                Guarda o actualiza un producto al inventario actual.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form className="space-y-4" onSubmit={guardarInsumo}>
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
                  <Button type="submit" className="flex-1 font-bold rounded-xl py-6 bg-cmykCyan text-slate-900 hover:bg-cmykCyan/90 border-0">
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
        </div>

        {/* COLUMNA 2: LISTADO (Con nueva altura) */}
        <div className="flex flex-col">
          <Card className="bg-slate-800 border-slate-700 shadow-sm flex-1 flex flex-col p-4">
            <CardHeader className="pb-3 border-b border-slate-700 mb-2">
              <CardTitle className="text-sm font-bold text-slate-300 uppercase tracking-wider flex justify-between items-center">
                Materia Prima en Almacén
                <Badge variant="outline" className="border-slate-600 text-slate-400 font-normal">Clic para editar</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="flex-1 p-0 px-4 pb-4">
              <div className="space-y-2 max-h-[65vh] overflow-y-auto pr-2 custom-scrollbar">
                {materiales.map((mat) => {
                  const esCritico = mat.stock_actual < 100;
                  return (
                    <div
                      key={mat.id}
                      onClick={() => cargarInsumo(mat)}
                      className={`p-3 rounded-xl border cursor-pointer transition-all flex justify-between items-center bg-slate-900/50 hover:bg-slate-900
                        ${esCritico ? 'border-red-500/50 hover:border-red-500 border-l-4 border-l-red-500' : 'border-slate-700 hover:border-cmykCyan'}`}
                    >
                      <div>
                        <p className="text-sm font-bold text-slate-200">{mat.nombre}</p>
                        <p className="text-xs text-slate-400 mt-1 flex items-center gap-1.5">
                          Stock: <span className={`font-bold ${esCritico ? 'text-red-400' : 'text-slate-200'}`}>
                            {mat.stock_actual.toLocaleString()} {mat.unidad_medida}
                          </span>
                          {esCritico && <AlertTriangle className="h-3 w-3 text-red-400" />}
                        </p>
                      </div>
                      <span className="text-[10px] uppercase font-bold bg-slate-800 text-slate-400 px-2 py-1 rounded border border-slate-700">ID: {mat.id}</span>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>

      </div>
    </div>
  );
}