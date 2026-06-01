import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'
import Productos from './pages/Productos'
import Categorias from './pages/Categorias'
import Historial from './pages/Historial'

function App() {
  return (
    <BrowserRouter>
      <nav>
        <Link to="/productos">Productos</Link>
        <Link to="/categorias">Categorías</Link>
        <Link to="/historial">Historial</Link>
      </nav>
      <Routes>
        <Route path="/productos" element={<Productos />} />
        <Route path="/categorias" element={<Categorias />} />
        <Route path="/historial" element={<Historial />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App