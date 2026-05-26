import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Productos from './pages/Productos'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/productos" element={<Productos />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App