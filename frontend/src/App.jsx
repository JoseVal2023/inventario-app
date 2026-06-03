import { useState } from 'react'
import { BrowserRouter, Routes, Route, Link, useLocation, Navigate } from 'react-router-dom'
import Productos from './pages/Productos'
import Categorias from './pages/Categorias'
import Historial from './pages/Historial'
import Alertas from './pages/Alertas'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Usuarios from './pages/Usuarios'

function Navbar({ usuario, onLogout }) {
  const location = useLocation()
  const links = [
    { to: '/dashboard', label: '📊 Dashboard' },
    { to: '/productos', label: 'Productos' },
    { to: '/categorias', label: 'Categorías' },
    { to: '/historial', label: 'Historial' },
    { to: '/alertas', label: '⚠️ Alertas' },
    { to: '/usuarios', label: '👥 Usuarios' },
  ]

  return (
    <nav className="bg-blue-600 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        <h1 className="text-white text-xl font-bold">📦 Sistema de Inventario</h1>
        <div className="flex gap-4 items-center">
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
          <span className="text-white text-sm">👤 {usuario.nombre}</span>
          <button
            onClick={onLogout}
            className="bg-white text-blue-600 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-100"
          >
            Cerrar sesión
          </button>
        </div>
      </div>
    </nav>
  )
}

function App() {
const [usuario, setUsuario] = useState(() => {
    const token = localStorage.getItem('token')
    const rol = localStorage.getItem('rol')
    const nombre = localStorage.getItem('nombre')
    return token && rol === 'admin' ? { token, rol, nombre } : null
  })

function handleLogin(datos) {
  if (datos.rol !== 'admin') {
    alert('Acceso denegado. Solo los administradores pueden acceder a esta plataforma.')
    localStorage.removeItem('token')
    localStorage.removeItem('rol')
    localStorage.removeItem('nombre')
    return
  }
  setUsuario(datos)
}

  function handleLogout() {
    localStorage.removeItem('token')
    localStorage.removeItem('rol')
    localStorage.removeItem('nombre')
    setUsuario(null)
  }

  if (!usuario) {
    return <Login onLogin={handleLogin} />
  }

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-50">
        <Navbar usuario={usuario} onLogout={handleLogout} />
        <main className="max-w-7xl mx-auto px-4 py-8">
          <Routes>
            <Route path="/productos" element={<Productos />} />
            <Route path="/categorias" element={<Categorias />} />
            <Route path="/historial" element={<Historial />} />
            <Route path="/alertas" element={<Alertas />} />
            <Route path="*" element={<Navigate to="/dashboard" />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/usuarios" element={<Usuarios />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  )
}

export default App