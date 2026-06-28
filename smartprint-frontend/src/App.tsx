import { useState } from 'react';
import Sidebar from './components/custom/Sidebar';
import Dashboard from './components/custom/Dashboard';
import Inventario from './components/custom/Inventario';
import Kanban from './components/custom/Kanban';

export default function App() {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'inventory' | 'operator'>('dashboard');

  return (
    // Cambiamos el contenedor principal a flex horizontal y limitamos la altura a la pantalla (h-screen)
    <div className="flex h-screen bg-background text-foreground dark overflow-hidden">

      {/* Integramos el nuevo componente modular */}
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Área principal de contenido (El scroll ahora es independiente aquí) */}
      <main className="flex-1 overflow-y-auto">
        <div className="p-6 max-w-[1400px] w-full mx-auto">
          {activeTab === 'dashboard' && <Dashboard />}
          {activeTab === 'inventory' && <Inventario />}
          {activeTab === 'operator' && <Kanban />}
        </div>
      </main>

    </div>
  );
}