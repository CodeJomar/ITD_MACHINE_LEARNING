import { LayoutDashboard, Package, MonitorSmartphone } from 'lucide-react';

interface SidebarProps {
  activeTab: 'dashboard' | 'inventory' | 'operator';
  setActiveTab: (tab: 'dashboard' | 'inventory' | 'operator') => void;
}

export default function Sidebar({ activeTab, setActiveTab }: SidebarProps) {
  const getNavClass = (tabName: string) => {
    const baseClass = "flex items-center gap-3 px-3 py-3 mx-2 rounded-xl transition-all duration-200 cursor-pointer overflow-hidden relative z-10";
    const activeClass = "bg-primary text-primary-foreground shadow-md shadow-primary/20";
    const inactiveClass = "text-muted-foreground hover:bg-muted hover:text-foreground";

    return `${baseClass} ${activeTab === tabName ? activeClass : inactiveClass}`;
  };

  return (
    <aside
      className="group flex flex-col h-screen bg-card transition-all duration-300 ease-in-out w-16 hover:w-64 z-20 shrink-0 overflow-y-auto overflow-x-hidden relative"
    >
      {/* Resplandor lateral con sombra gradiente */}
      <div className="absolute right-0 top-0 bottom-0 w-[1px] bg-gradient-to-b from-cmykCyan to-cmykMagenta opacity-40 shadow-[0_0_15px_3px_rgba(6,182,212,0.4)] group-hover:opacity-80 transition-opacity duration-300 z-0 pointer-events-none"></div>

      {/* Cabecera del Sidebar (Logo y Nombre) */}
      <div className="flex items-center gap-3 px-3 py-6 mb-4 relative z-10">
        <div className="h-10 w-10 shrink-0 rounded-lg bg-gradient-to-tr from-cmykCyan to-cmykMagenta flex items-center justify-center font-bold text-white shadow-[0_0_12px_rgba(217,70,239,0.4)]">
          P
        </div>
        <span className="text-xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-cmykCyan to-cmykMagenta opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
          SmartPrint SAC
        </span>
      </div>

      {/* Navegación */}
      <nav className="flex flex-col gap-2 flex-1">
        <button onClick={() => setActiveTab('dashboard')} className={getNavClass('dashboard')}>
          <LayoutDashboard className="h-5 w-5 shrink-0" />
          <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap font-semibold text-sm">
            Dashboard Recepción
          </span>
        </button>

        <button onClick={() => setActiveTab('inventory')} className={getNavClass('inventory')}>
          <Package className="h-5 w-5 shrink-0" />
          <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap font-semibold text-sm">
            Inventario y Catálogo
          </span>
        </button>

        <button onClick={() => setActiveTab('operator')} className={getNavClass('operator')}>
          <MonitorSmartphone className="h-5 w-5 shrink-0" />
          <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap font-semibold text-sm">
            Vista Operario
          </span>
        </button>
      </nav>
    </aside>
  );
}