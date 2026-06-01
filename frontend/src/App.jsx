import { BrowserRouter, Routes, Route, Link, useLocation } from 'react-router-dom'
import Productos from './pages/Productos'
import Categorias from './pages/Categorias'
import Historial from './pages/Historial'
import Alertas from './pages/Alertas'

function Navbar() {
  const location = useLocation()
  const links = [
    { to: '/productos', label: 'Productos' },
    { to: '/categorias', label: 'Categorías' },
    { to: '/historial', label: 'Historial' },
    { to: '/alertas', label: '⚠️ Alertas' },
  ]

  return (
    <nav className="bg-blue-600 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        <h1 className="text-white text-xl font-bold">📦 Sistema de Inventario</h1>
        <div className="flex gap-4">
          {links.map(link => (
            <Link
              key={link.to}
              to={link.to}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                location.pathname === link.to
                  ? 'bg-white text-blue-600'
                  : 'text-white hover:bg-blue-500'
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  )
}

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <main className="max-w-7xl mx-auto px-4 py-8">
          <Routes>
            <Route path="/productos" element={<Productos />} />
            <Route path="/categorias" element={<Categorias />} />
            <Route path="/historial" element={<Historial />} />
            <Route path="/alertas" element={<Alertas />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  )
}

export default App