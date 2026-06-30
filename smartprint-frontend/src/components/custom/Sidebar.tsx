import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Package, MonitorSmartphone, BookOpen } from 'lucide-react';

export default function Sidebar() {
  const location = useLocation();
  const currentPath = location.pathname;

  const getNavClass = (path: string) => {
    // Agregamos 'group/link' para micro-interacciones individuales
    const baseClass = "group/link flex items-center gap-3 px-3 py-3 mx-2 rounded-xl transition-all duration-300 cursor-pointer overflow-hidden relative z-10 font-semibold text-sm";

    // NUEVO DISEÑO: Sin fondo sólido. 
    // 1. El SVG toma el stroke del gradiente definido abajo y emite un leve resplandor.
    // 2. El span recorta un fondo degradado para que el texto herede los colores.
    const activeClass = "bg-transparent " +
      "[&>svg]:stroke-[url(#cmyk-grad)] [&>svg]:drop-shadow-[0_0_6px_rgba(217,70,239,0.4)] " +
      "[&>span]:text-transparent [&>span]:bg-clip-text [&>span]:bg-gradient-to-r [&>span]:from-cmykCyan [&>span]:to-cmykMagenta";

    const inactiveClass = "text-muted-foreground hover:bg-slate-800/40 hover:text-slate-200";

    const isActive = path === '/dashboard'
      ? currentPath === '/dashboard' || currentPath === '/'
      : currentPath.startsWith(path);

    return `${baseClass} ${isActive ? activeClass : inactiveClass}`;
  };

  return (
    <aside
      className="group flex flex-col h-screen bg-card transition-all duration-300 ease-in-out w-16 hover:w-64 z-20 shrink-0 overflow-y-auto overflow-x-hidden relative"
    >
      {/* TRUCO ARQUITECTÓNICO: Definición del degradado SVG oculto */}
      <svg width="0" height="0" className="absolute pointer-events-none">
        <defs>
          <linearGradient id="cmyk-grad" x1="0%" y1="0%" x2="100%" y2="100%">
            {/* Usamos los colores exactos de tu paleta Cyan y Magenta */}
            <stop offset="0%" stopColor="#06b6d4" />
            <stop offset="100%" stopColor="#d946ef" />
          </linearGradient>
        </defs>
      </svg>

      {/* Resplandor lateral con sombra gradiente de fondo */}
      <div className="absolute right-0 top-0 bottom-0 w-[1px] bg-gradient-to-b from-cmykCyan to-cmykMagenta opacity-40 shadow-[0_0_15px_3px_rgba(6,182,212,0.4)] group-hover:opacity-80 transition-opacity duration-300 z-0 pointer-events-none"></div>

      {/* Cabecera / Isotipo */}
      <div className="flex items-center gap-3 px-3 py-6 mb-4 relative z-10">
        <div className="h-10 w-10 shrink-0 rounded-lg bg-gradient-to-tr from-cmykCyan to-cmykMagenta flex items-center justify-center font-bold text-white shadow-[0_0_12px_rgba(217,70,239,0.4)]">
          P
        </div>
        <span className="text-xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-cmykCyan to-cmykMagenta opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
          SmartPrint SAC
        </span>
      </div>

      {/* Menú de Navegación */}
      <nav className="flex flex-col gap-2 flex-1 relative z-10">
        <Link to="/dashboard" className={getNavClass('/dashboard')}>
          <LayoutDashboard className="h-5 w-5 shrink-0 transition-transform duration-300 group-hover/link:scale-110" />
          <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
            Dashboard Recepción
          </span>
        </Link>

        <Link to="/inventario" className={getNavClass('/inventario')}>
          <Package className="h-5 w-5 shrink-0 transition-transform duration-300 group-hover/link:scale-110" />
          <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
            Gestión de Inventario
          </span>
        </Link>

        <Link to="/catalogo" className={getNavClass('/catalogo')}>
          <BookOpen className="h-5 w-5 shrink-0 transition-transform duration-300 group-hover/link:scale-110" />
          <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
            Catálogo y Reglas
          </span>
        </Link>

        <Link to="/operario" className={getNavClass('/operario')}>
          <MonitorSmartphone className="h-5 w-5 shrink-0 transition-transform duration-300 group-hover/link:scale-110" />
          <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
            Vista Operario
          </span>
        </Link>
      </nav>
    </aside>
  );
}