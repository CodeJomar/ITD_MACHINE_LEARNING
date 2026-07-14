import { useState } from 'react';
import { Package, AlertTriangle, Plus, RefreshCw, BrainCircuit, Droplets, CalendarRange, TrendingUp } from 'lucide-react';
import { useInventario } from '@/hooks/useInventario';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";

export default function Inventario() {
  const {
    materiales, insumoForm, setInsumoForm,
    guardarInsumo, cargarInsumo
  } = useInventario();

  // Estado para el modal de predicción de inventario
  const [predDialogOpen, setPredDialogOpen] = useState(false);
  const [predForm, setPredForm] = useState({ pedidos: '', tiraje: '', campana: '0' });
  const [predResult, setPredResult] = useState<{ litros: number; mensaje: string } | null>(null);
  const [isPredicting, setIsPredicting] = useState(false);

  const handlePredict = async () => {
    setIsPredicting(true);
    setPredResult(null);
    try {
      const res = await fetch('http://localhost:8000/api/predict-inventory', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          pedidos_esperados_mes: Number(predForm.pedidos),
          promedio_tiraje_mensual: Number(predForm.tiraje),
          es_campana_alta: Number(predForm.campana)
        })
      });
      const data = await res.json();
      setPredResult({ litros: data.proyeccion_tinta_litros, mensaje: data.mensaje });
    } catch (err) {
      console.error('Error predicción inventario:', err);
    } finally {
      setIsPredicting(false);
    }
  };

  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-500 w-full">

      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-100 flex items-center gap-2">
            <Package className="text-cmykCyan h-6 w-6" /> Gestión de Inventario
          </h2>
          <p className="text-sm text-slate-400 mt-1">
            Administre el inventario físico de materia prima en el almacén.
          </p>
        </div>
        <Button
          onClick={() => { setPredResult(null); setPredDialogOpen(true); }}
          className="bg-cmykMagenta hover:bg-cmykMagenta/80 text-white font-bold rounded-xl px-5 py-5 flex items-center gap-2 shadow-md shadow-cmykMagenta/20"
        >
          <BrainCircuit className="h-5 w-5" />
          Proyección de Demanda IA
        </Button>
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

      {/* DIALOG: PREDICCIÓN DE DEMANDA DE INVENTARIO */}
      <Dialog open={predDialogOpen} onOpenChange={setPredDialogOpen}>
        <DialogContent className="border border-slate-700 text-slate-200 sm:max-w-md bg-cmykDark/95">
          <DialogHeader>
            <DialogTitle className="text-cmykMagenta text-lg flex items-center gap-2">
              <BrainCircuit className="h-5 w-5" /> Proyección de Demanda de Tinta
            </DialogTitle>
            <DialogDescription className="text-slate-400">
              Modelo de Regresión Lineal entrenado con datos históricos del taller.
            </DialogDescription>
          </DialogHeader>

          {!predResult ? (
            <div className="space-y-4 py-2">
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-slate-400 uppercase">Pedidos esperados este mes</Label>
                <Input
                  type="number"
                  value={predForm.pedidos}
                  onChange={e => setPredForm({ ...predForm, pedidos: e.target.value })}
                  className="bg-slate-900 border-slate-700 text-slate-200 focus-visible:ring-cmykMagenta rounded-xl px-4 py-5"
                  placeholder="Ej. 80"
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-slate-400 uppercase">Promedio de tiraje mensual</Label>
                <Input
                  type="number"
                  value={predForm.tiraje}
                  onChange={e => setPredForm({ ...predForm, tiraje: e.target.value })}
                  className="bg-slate-900 border-slate-700 text-slate-200 focus-visible:ring-cmykMagenta rounded-xl px-4 py-5"
                  placeholder="Ej. 5000"
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-slate-400 uppercase">Temporada de campaña alta</Label>
                <div className="flex gap-3">
                  <Button
                    type="button"
                    onClick={() => setPredForm({ ...predForm, campana: '0' })}
                    className={`flex-1 rounded-xl py-5 font-bold text-xs ${
                      predForm.campana === '0'
                        ? 'bg-slate-600 text-slate-100 border border-slate-500'
                        : 'bg-slate-900 text-slate-400 border border-slate-700 hover:bg-slate-800'
                    }`}
                  >
                    No
                  </Button>
                  <Button
                    type="button"
                    onClick={() => setPredForm({ ...predForm, campana: '1' })}
                    className={`flex-1 rounded-xl py-5 font-bold text-xs ${
                      predForm.campana === '1'
                        ? 'bg-cmykMagenta text-white border border-cmykMagenta'
                        : 'bg-slate-900 text-slate-400 border border-slate-700 hover:bg-slate-800'
                    }`}
                  >
                    Sí, campaña alta
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-4 py-4">
              <div className="flex items-center gap-4 bg-cmykMagenta/5 p-4 rounded-xl border border-cmykMagenta/30">
                <div className="bg-cmykMagenta/10 p-2.5 rounded-lg">
                  <Droplets className="h-5 w-5 text-cmykMagenta" />
                </div>
                <div>
                  <p className="text-[11px] text-slate-400 uppercase font-semibold tracking-wide">Tinta Proyectada</p>
                  <p className="text-2xl font-bold text-slate-100">{predResult.litros} <span className="text-sm font-normal text-slate-400">litros</span></p>
                </div>
              </div>
              <div className="flex items-center gap-4 bg-slate-800/80 p-4 rounded-xl border border-slate-700">
                <div className="bg-slate-700 p-2.5 rounded-lg">
                  <TrendingUp className="h-5 w-5 text-cmykCyan" />
                </div>
                <div>
                  <p className="text-[11px] text-slate-400 uppercase font-semibold tracking-wide">Recomendación</p>
                  <p className="text-sm text-slate-300">{predResult.mensaje}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 bg-slate-800/50 p-3 rounded-xl border border-slate-700">
                <CalendarRange className="h-4 w-4 text-slate-500" />
                <p className="text-xs text-slate-400">Parámetros: {predForm.pedidos} pedidos, {Number(predForm.tiraje).toLocaleString()} tiraje, {predForm.campana === '1' ? 'Campaña Alta' : 'Temporada Normal'}</p>
              </div>
            </div>
          )}

          <DialogFooter className="sm:justify-center">
            {!predResult ? (
              <Button
                type="button"
                disabled={isPredicting || !predForm.pedidos || !predForm.tiraje}
                className="bg-cmykMagenta text-white font-bold hover:bg-cmykMagenta/80 w-full sm:w-auto"
                onClick={handlePredict}
              >
                {isPredicting ? 'Calculando...' : 'Ejecutar Predicción'}
              </Button>
            ) : (
              <Button
                type="button"
                className="bg-cmykCyan text-slate-900 font-bold hover:bg-cyan-300 w-full sm:w-auto"
                onClick={() => setPredDialogOpen(false)}
              >
                Entendido
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

    </div>
  );
}