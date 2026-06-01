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
      <h1>Categorías</h1>
      <form onSubmit={agregarCategoria}>
        <input
          placeholder="Nombre de la categoría"
          value={nuevaCategoria.nombre}
          onChange={e => setNuevaCategoria({ nombre: e.target.value })}
        />
        <button type="submit">Agregar Categoría</button>
      </form>
      <table>
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {categorias.map(categoria => (
            <tr key={categoria.id}>
              <td>{categoria.nombre}</td>
              <td>
                <button onClick={() => eliminarCategoria(categoria.id)}>Eliminar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default Categorias