import { useState, useEffect } from 'react'
import api from '../services/api'

function Categorias() {
  const [categorias, setCategorias] = useState([])
  const [nuevaCategoria, setNuevaCategoria] = useState({ nombre: '' })

  useEffect(() => {
    api.get('/categorias')
      .then(response => setCategorias(response.data.categorias))
      .catch(error => console.error(error))
  }, [])

  function agregarCategoria(e) {
    e.preventDefault()
    api.post('/categorias', nuevaCategoria)
      .then(response => {
        setCategorias([...categorias, response.data])
        setNuevaCategoria({ nombre: '' })
      })
      .catch(error => console.error(error))
  }

  function eliminarCategoria(id) {
    api.delete(`/categorias/${id}`)
      .then(() => setCategorias(categorias.filter(c => c.id !== id)))
      .catch(error => console.error(error))
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Categorías</h1>

      <div className="bg-white rounded-xl shadow p-6 mb-6">
        <h2 className="text-lg font-semibold text-gray-700 mb-4">Agregar Categoría</h2>
        <form onSubmit={agregarCategoria} className="flex gap-3">
          <input
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 flex-1"
            placeholder="Nombre de la categoría"
            value={nuevaCategoria.nombre}
            onChange={e => setNuevaCategoria({ nombre: e.target.value })}
          />
          <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium">
            Agregar
          </button>
        </form>
      </div>

      <div className="bg-white rounded-xl shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-blue-600 text-white">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-semibold">Nombre</th>
              <th className="px-6 py-3 text-left text-sm font-semibold">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {categorias.map((categoria, index) => (
              <tr key={categoria.id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                <td className="px-6 py-4 text-sm text-gray-800 font-medium">{categoria.nombre}</td>
                <td className="px-6 py-4">
                  <button onClick={() => eliminarCategoria(categoria.id)}
                    className="bg-red-100 text-red-700 px-3 py-1 rounded-lg text-sm hover:bg-red-200 transition-colors">
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default Categorias