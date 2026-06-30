import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './components/custom/Sidebar';
import Dashboard from './components/custom/Dashboard';
import Inventario from './components/custom/Inventario';
import Catalogo from './components/custom/Catalogo';
import Kanban from './components/custom/Kanban';

export default function App() {
  return (
    // BrowserRouter envuelve la app para habilitar el manejo de URLs
    <BrowserRouter>
      <div className="flex h-screen bg-background text-foreground dark overflow-hidden">

        {/* El Sidebar ya no necesita props, él mismo leerá la URL actual */}
        <Sidebar />

        <main className="flex-1 overflow-y-auto">
          <div className="p-6 max-w-[1400px] w-full mx-auto">
            {/* Aquí definimos qué componente se renderiza en cada ruta */}
            <Routes>
              {/* Redirección por defecto: Si entra a "/", lo manda a "/dashboard" */}
              <Route path="/" element={<Navigate to="/dashboard" replace />} />

              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/inventario" element={<Inventario />} />
              <Route path="/catalogo" element={<Catalogo />} />
              <Route path="/operario" element={<Kanban />} />
            </Routes>
          </div>
        </main>

      </div>
    </BrowserRouter>
  );
}