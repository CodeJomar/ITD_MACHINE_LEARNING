import { useState } from 'react';
import { Play, CheckCircle2, Activity, ArrowLeft, Check } from 'lucide-react';

// Hook personalizado
import { useKanban } from '@/hooks/useKanban';

// Componentes de shadcn/ui
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function Kanban() {
  const { moverTarea, pendientes, enImpresion, finalizadosVisibles, totalFinalizados } = useKanban();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [tareaFinalizar, setTareaFinalizar] = useState<string | null>(null);
  const [mermaReal, setMermaReal] = useState<string>('');

  const handleOpenDialog = (id: string) => {
    setTareaFinalizar(id);
    setMermaReal('');
    setDialogOpen(true);
  };

  const handleConfirm = () => {
    if (tareaFinalizar) {
      moverTarea(tareaFinalizar, 'finalizado', mermaReal ? Number(mermaReal) : 0);
    }
    setDialogOpen(false);
    setTareaFinalizar(null);
  };

  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-500 w-full h-full">

      {/* Cabecera del Monitor */}
      <div className="flex justify-between items-center bg-slate-800/50 p-4 rounded-2xl border border-slate-700/50">
        <div>
          <h2 className="text-2xl font-bold text-slate-100 flex items-center gap-2">
            <Activity className="text-emerald-400 h-6 w-6" /> Monitor Industrial de Planta
          </h2>
          <p className="text-sm text-slate-400 mt-1">
            Cola de producción automatizada para el control directo en taller.
          </p>
        </div>
        <div className="bg-emerald-500/10 text-emerald-400 text-xs px-4 py-2 rounded-full font-semibold border border-emerald-500/20 flex items-center gap-2 shadow-[0_0_10px_rgba(16,185,129,0.2)]">
          <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.8)]"></span>
          Terminal de Planta Sincronizada
        </div>
      </div>

      {/* Grid del Tablero Kanban */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-2 items-start">

        {/* ==========================================
            COLUMNA 1: PENDIENTES
            ========================================== */}
        <div className="bg-slate-900/50 rounded-2xl border border-slate-800 p-4 flex flex-col gap-4 h-[630px]">
          <div className="flex justify-between items-center border-b border-slate-800 pb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">1. Pendientes de Asignación</span>
            <Badge variant="secondary" className="bg-slate-800 text-slate-300 font-bold px-2 py-0.5 rounded-md">
              {pendientes.length}
            </Badge>
          </div>

          <div className="space-y-3 overflow-y-auto custom-scrollbar flex-1 pr-2 pb-2 min-h-0">
            {pendientes.map(tarea => (
              <Card key={tarea.id} className="bg-slate-800 border-slate-700 shadow-md hover:border-cmykCyan transition-colors">
                <CardContent className="p-4 space-y-3">
                  <div className="flex justify-between items-start">
                    <Badge className="bg-cmykCyan/10 text-cmykCyan hover:bg-cmykCyan/20 border-cmykCyan/20 font-bold text-[10px]">
                      {tarea.tipo}
                    </Badge>
                    <span className="text-slate-500 font-mono text-[10px]">{tarea.id}</span>
                  </div>
                  <h4 className="font-bold text-sm text-slate-200 leading-tight">{tarea.cliente}</h4>
                  <p className="text-xs text-slate-400">
                    Cantidad: <span className="text-slate-200 font-medium">{tarea.cantidad}</span>
                  </p>
                  <Button
                    onClick={() => moverTarea(tarea.id, 'impresion')}
                    className="w-full bg-slate-700 hover:bg-cmykCyan hover:text-slate-900 text-slate-300 font-bold text-xs py-5 rounded-xl transition-all mt-2 group"
                  >
                    Iniciar Impresión <Play className="ml-2 h-3 w-3 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* ==========================================
            COLUMNA 2: EN MÁQUINA (EJECUCIÓN)
            ========================================== */}
        <div className="bg-slate-900/50 rounded-2xl border border-slate-800 p-4 flex flex-col gap-4 h-[630px]">
          <div className="flex justify-between items-center border-b border-slate-800 pb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-cmykYellow">2. En Máquina / Ejecución</span>
            <Badge className="bg-cmykYellow/10 text-cmykYellow border-cmykYellow/20 font-bold px-2 py-0.5 rounded-md hover:bg-cmykYellow/20">
              {enImpresion.length}
            </Badge>
          </div>

          <div className="space-y-3 overflow-y-auto custom-scrollbar flex-1 pr-2 pb-2 min-h-0">
            {enImpresion.map(tarea => (
              <Card key={tarea.id} className="bg-slate-800 border-cmykYellow/40 shadow-[0_4px_20px_-10px_rgba(234,179,8,0.3)] relative overflow-hidden">
                {/* Línea animada de progreso simulado */}
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-cmykYellow to-amber-500 animate-pulse"></div>

                <CardContent className="p-4 space-y-3 pt-5">
                  <div className="flex justify-between items-start">
                    <Badge className="bg-cmykYellow/10 text-cmykYellow hover:bg-cmykYellow/20 border-cmykYellow/20 font-bold text-[10px]">
                      {tarea.tipo}
                    </Badge>
                    <span className="text-slate-500 font-mono text-[10px]">{tarea.id}</span>
                  </div>
                  <h4 className="font-bold text-sm text-slate-200 leading-tight">{tarea.cliente}</h4>
                  <p className="text-xs text-slate-400">
                    Cantidad: <span className="text-slate-200 font-medium">{tarea.cantidad}</span>
                  </p>
                  <Button
                    onClick={() => handleOpenDialog(tarea.id)}
                    className="w-full bg-cmykYellow hover:bg-amber-500 text-slate-900 font-bold text-xs py-5 rounded-xl transition-all mt-2 group shadow-md shadow-cmykYellow/20"
                  >
                    Finalizar Tiraje <CheckCircle2 className="ml-2 h-4 w-4 group-hover:scale-110 transition-transform" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* ==========================================
            COLUMNA 3: POST-PRENSA Y ACABADOS
            ========================================== */}
        <div className="bg-slate-900/50 rounded-2xl border border-slate-800 p-4 flex flex-col gap-4 h-[630px]">
          <div className="flex justify-between items-center border-b border-slate-800 pb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-cmykMagenta">3. Post-prensa y Acabados</span>
            <Badge variant="secondary" className="bg-slate-800 text-slate-300 font-bold px-2 py-0.5 rounded-md">
              {totalFinalizados > 5 ? `5 de ${totalFinalizados}` : totalFinalizados}
            </Badge>
          </div>

          <div className="space-y-3 overflow-y-auto  flex-1 pr-2 pb-2 min-h-0">
            {finalizadosVisibles.map(tarea => (
              <Card key={tarea.id} className="bg-slate-800/80 border-slate-700 shadow-sm opacity-75 grayscale-[20%] transition-all hover:opacity-100 hover:grayscale-0">
                <CardContent className="p-4 space-y-3">
                  <div className="flex justify-between items-start">
                    <Badge className="bg-cmykMagenta/10 text-cmykMagenta hover:bg-cmykMagenta/20 border-cmykMagenta/20 font-bold text-[10px]">
                      {tarea.tipo}
                    </Badge>
                    <span className="text-slate-500 font-mono text-[10px]">{tarea.id}</span>
                  </div>
                  {/* Texto tachado para simular completado */}
                  <h4 className="font-bold text-sm text-slate-400 line-through leading-tight">{tarea.cliente}</h4>
                  <p className="text-xs text-slate-500 bg-slate-900 p-2 rounded-lg border border-slate-800">
                    Estado: <span className="text-emerald-500 font-medium ml-1">Listo para Despacho</span>
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="border border-slate-300 text-slate-200 sm:max-w-md bg-cmykDark/95 ">
          <DialogHeader>
            <DialogTitle className="text-cmykCyan">Reportar Merma Real</DialogTitle>
            <DialogDescription className="text-slate-400">
              Ingresa la cantidad exacta de unidades dañadas o botadas a la basura para afinar la Inteligencia Artificial a futuro.
            </DialogDescription>
          </DialogHeader>
          <div className="flex items-center space-x-2 py-4">
            <div className="grid flex-1 gap-2">
              <Label htmlFor="merma" className="text-slate-400">
                Merma real (Unidades/Pliegos)
              </Label>
              <Input
                id="merma"
                type="number"
                value={mermaReal}
                onChange={(e) => setMermaReal(e.target.value)}
                className="bg-slate-800 border-slate-700 text-slate-200"
                placeholder="Ej. 5"
              />
            </div>
          </div>
          <DialogFooter className="sm:justify-center">
            <Button
              type="button"
              variant="outline"
              className="border-slate-700 text-slate-300 hover:bg-slate-800"
              onClick={() => setDialogOpen(false)}
            >
              <ArrowLeft />
              Cancelar
            </Button>
            <Button
              type="button"
              className="bg-cmykCyan text-slate-900 font-bold hover:bg-cyan-300"
              onClick={handleConfirm}
            >
              <Check />
              Confirmar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}