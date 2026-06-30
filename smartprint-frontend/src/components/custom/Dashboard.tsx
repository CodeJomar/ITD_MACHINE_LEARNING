import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

// Hooks personalizados
import { useDashboard } from '@/hooks/useDashboard';

// Componentes de shadcn/ui
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";

export default function Dashboard() {

  const {
    catalogo,
    ordenForm,
    setOrdenForm,
    isPredicting,
    procesarPedido,
    colaPedidos,
    chartData,
    kpiPedidosHoy,
    kpiEnCola,
    kpiTerminados
  } = useDashboard();

  const isFormValid = ordenForm.cliente !== '' && ordenForm.catalogoId !== '' && Number(ordenForm.cantidad) > 0 && Number(ordenForm.ancho) > 0 && Number(ordenForm.alto) > 0;
  const isStockValid = Number(ordenForm.cantidad) <= 15000;
  const canSubmit = isFormValid && isStockValid && !isPredicting;

  const limpiarFormulario = () => {
    setOrdenForm({ cliente: '', catalogoId: '', materialId: '', cantidad: '', ancho: '', alto: '' });
  };

  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-500 w-full">

      {/* ==========================================
          BLOQUE SUPERIOR: KPIs, GRÁFICO Y FORMULARIO
          ========================================== */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Columna Izquierda */}
        <div className="lg:col-span-2 flex flex-col gap-6">

          {/* Tarjetas KPI */}
          <div className="grid grid-cols-3 gap-4">
            <Card className="bg-slate-800 border-slate-700 shadow-sm">
              <CardContent className="p-4">
                <p className="text-xs text-slate-400 font-medium uppercase">Pedidos Hoy</p>
                <p className="text-2xl font-bold mt-1 text-cmykCyan">{kpiPedidosHoy}</p>
              </CardContent>
            </Card>
            <Card className="bg-slate-800 border-slate-700 shadow-sm">
              <CardContent className="p-4">
                <p className="text-xs text-slate-400 font-medium uppercase">En Cola</p>
                <p className="text-2xl font-bold mt-1 text-cmykYellow">{kpiEnCola}</p>
              </CardContent>
            </Card>
            <Card className="bg-slate-800 border-slate-700 shadow-sm">
              <CardContent className="p-4">
                <p className="text-xs text-slate-400 font-medium uppercase">Terminados</p>
                <p className="text-2xl font-bold mt-1 text-cmykMagenta">{kpiTerminados}</p>
              </CardContent>
            </Card>
          </div>

          {/* Gráfico */}
          <Card className="bg-slate-800 border-slate-700 flex flex-col shadow-sm flex-1 p-4">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg text-slate-100">Flujo de Tiempos en Planta</CardTitle>
              <CardDescription className="text-xs text-slate-400">Monitoreo de fases operativas estimadas para cada encargo.</CardDescription>
            </CardHeader>
            <CardContent className="h-full min-h-[250px] w-full relative pb-6">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <XAxis dataKey="name" stroke="#94a3b8" tick={{ fontSize: 12 }} axisLine={false} />
                  <YAxis stroke="#94a3b8" tick={{ fontSize: 12 }} axisLine={false} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#1E293B', borderColor: '#334155', color: '#f8fafc', borderRadius: '8px' }}
                    itemStyle={{ color: '#06B6D4' }}
                  />
                  <Line type="monotone" dataKey="Tiempo" stroke="#06B6D4" strokeWidth={3} dot={{ r: 5, fill: '#06B6D4', strokeWidth: 2, stroke: '#0F172A' }} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Columna Derecha: Formulario */}
        <Card className="bg-slate-800 border-slate-700 shadow-sm h-full flex flex-col justify-between p-4">
          <CardHeader className="border-b border-slate-700 pb-3 mb-4">
            <CardTitle className="text-lg text-slate-100">Recepción de Pedidos</CardTitle>
          </CardHeader>
          <CardContent>
            <form className="space-y-4" onSubmit={procesarPedido}>

              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-slate-400 uppercase">Nombre del Cliente</Label>
                <Input
                  value={ordenForm.cliente}
                  onChange={e => setOrdenForm({ ...ordenForm, cliente: e.target.value })}
                  className="bg-slate-900 border-slate-700 text-slate-200 focus-visible:ring-cmykCyan rounded-xl px-4 py-5"
                  placeholder="Ej. Corporación Vega"
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-slate-400 uppercase">Tipo de Impresión</Label>
                <Select
                  value={ordenForm.catalogoId}
                  onValueChange={(value) => setOrdenForm({ ...ordenForm, catalogoId: value ?? '' })}>
                  <SelectTrigger className="w-full bg-slate-900 border-slate-700 text-slate-200 focus:ring-cmykCyan rounded-xl px-4 py-5">
                    <SelectValue placeholder="Seleccione línea...">
                      {catalogo.find(c => c.id.toString() === ordenForm.catalogoId)?.nombre_impresion || "Seleccione línea..."}
                    </SelectValue>
                  </SelectTrigger>

                  <SelectContent
                    alignItemWithTrigger={false}
                    side="bottom"
                    sideOffset={8}
                    className="bg-slate-800 border border-white/10 text-slate-200 shadow-[0_18px_35px_-18px_rgba(255,255,255,0.35),0_0_0_1px_rgba(255,255,255,0.12)] ring-1 ring-white/15 rounded-xl z-50 min-w-[var(--anchor-width)]"
                  >
                    {catalogo.map(cat => (
                      <SelectItem key={cat.id} value={cat.id.toString()} className="focus:bg-slate-700 focus:text-slate-100 cursor-pointer py-2.5">
                        {cat.nombre_impresion}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-slate-400 uppercase">Volumen de Lote</Label>
                <Input
                  type="number"
                  value={ordenForm.cantidad}
                  onChange={e => setOrdenForm({ ...ordenForm, cantidad: e.target.value })}
                  className="bg-slate-900 border-slate-700 text-slate-200 focus-visible:ring-cmykCyan rounded-xl px-4 py-5"
                  placeholder="Ej. 5000"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold text-slate-400 uppercase">Ancho (cm)</Label>
                  <Input
                    type="number"
                    value={ordenForm.ancho}
                    onChange={e => setOrdenForm({ ...ordenForm, ancho: e.target.value })}
                    className="bg-slate-900 border-slate-700 text-slate-200 focus-visible:ring-cmykCyan rounded-xl px-4 py-5"
                    placeholder="0"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold text-slate-400 uppercase">Alto (cm)</Label>
                  <Input
                    type="number"
                    value={ordenForm.alto}
                    onChange={e => setOrdenForm({ ...ordenForm, alto: e.target.value })}
                    className="bg-slate-900 border-slate-700 text-slate-200 focus-visible:ring-cmykCyan rounded-xl px-4 py-5"
                    placeholder="0"
                  />
                </div>
              </div>

              <div className="mt-6 space-y-3 pt-2">
                <div className="bg-slate-900 p-4 rounded-xl border border-slate-700 space-y-2 mb-4">
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wide">Reglas de Machine Learning</p>
                  <div className="flex items-center gap-2 text-xs">
                    <span className={`h-2 w-2 rounded-full ${isFormValid ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.6)]' : 'bg-red-500'}`}></span>
                    <span className="text-slate-300">Variables predictivas completas</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs">
                    <span className={`h-2 w-2 rounded-full ${isFormValid && isStockValid ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.6)]' : 'bg-red-500'}`}></span>
                    <span className="text-slate-300">Disponibilidad en Almacén</span>
                  </div>
                </div>

                <Button
                  type="button"
                  variant="outline"
                  onClick={limpiarFormulario}
                  className="w-full border-slate-600 text-slate-400 hover:text-slate-200 hover:bg-slate-700 rounded-xl py-6"
                >
                  Limpiar Formulario
                </Button>

                <Button
                  type="submit"
                  disabled={!canSubmit}
                  className={`w-full rounded-xl py-6 ${canSubmit
                    ? 'btn-rgb'
                    : 'bg-slate-700 text-slate-500 cursor-not-allowed border-0 font-bold'
                    }`}
                >
                  {isPredicting ? 'Calculando IA...' : '✦ Predecir y Confirmar Pedido'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>

      {/* ==========================================
          BLOQUE INFERIOR: COLA DE PEDIDOS
          ========================================== */}
      <div className="mt-2">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h3 className="text-lg font-bold text-slate-100">Próximos Ingresos a Producción</h3>
            <p className="text-xs text-slate-400 mt-1">Trabajos pre-aprobados. <span className="text-cmykCyan">Posiciona el ratón sobre una tarjeta</span> para ver la predicción de IA.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
          {colaPedidos.map((pedido) => (
            <Card key={pedido.id} className="group relative bg-slate-800 border border-slate-700 rounded-xl transition-all hover:border-white cursor-pointer h-24 flex flex-col justify-center overflow-hidden shadow-sm">

              <div className="flex justify-between items-center transition-opacity duration-300 group-hover:opacity-0 absolute inset-0 p-4">
                <div className="flex flex-col justify-center">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-500">{pedido.id}</span>
                    <h4 className="font-bold text-slate-200 text-sm truncate max-w-[120px]" title={pedido.cliente}>{pedido.cliente}</h4>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1">{pedido.tipo}</p>
                </div>
                <div className="text-right flex flex-col justify-center">
                  <span className="text-[10px] text-slate-500 uppercase font-bold">Volumen</span>
                  <p className="font-bold text-slate-200 text-sm">{pedido.cantidad.toLocaleString()}</p>
                </div>
              </div>

              <div className="absolute inset-0 bg-slate-900/95 p-4 flex flex-col justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-400">Dimensión: <span className="text-slate-100 font-semibold">{pedido.ancho}x{pedido.alto} cm</span></span>
                  <span className="text-slate-400">Est. IA: <span className="text-emerald-400 font-semibold">{pedido.tiempoEstimado}</span></span>
                </div>
                <div className="flex justify-between items-center text-xs mt-3">
                  <span className="text-slate-400">Merma IA: <span className="text-cmykYellow font-semibold">{pedido.merma}</span></span>
                  <Badge variant="outline" className="bg-slate-800 text-slate-300 border-slate-700 font-normal">{pedido.estado}</Badge>
                </div>
              </div>

            </Card>
          ))}
        </div>
      </div>

    </div>
  );
}