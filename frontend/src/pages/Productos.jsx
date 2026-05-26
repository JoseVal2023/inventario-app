import { useState, useEffect } from 'react'
import api from '../services/api'

function Productos() {
  const [productos, setProductos] = useState([])
  const [nuevoProducto, setNuevoProducto] = useState({
    nombre: '',
    precio: '',
    cantidad: '',
    stock_minimo: '',
    categoria_id: null
  })

  useEffect(() => {
    api.get('/productos')
      .then(response => setProductos(response.data.productos))
      .catch(error => console.error(error))
  }, [])

  function agregarProducto(e) {
    e.preventDefault()
    api.post('/productos', nuevoProducto)
      .then(response => {
        setProductos([...productos, response.data])
        setNuevoProducto({ nombre: '', precio: '', cantidad: '', stock_minimo: '', categoria_id: null })
      })
      .catch(error => console.error(error))
  }

  return (
    <div>
      <h1>Productos</h1>
      <form onSubmit={agregarProducto}>
        <input
          placeholder="Nombre"
          value={nuevoProducto.nombre}
          onChange={e => setNuevoProducto({...nuevoProducto, nombre: e.target.value})}
        />
        <input
          placeholder="Precio"
          type="number"
          value={nuevoProducto.precio}
          onChange={e => setNuevoProducto({...nuevoProducto, precio: e.target.value})}
        />
        <input
          placeholder="Cantidad"
          type="number"
          value={nuevoProducto.cantidad}
          onChange={e => setNuevoProducto({...nuevoProducto, cantidad: e.target.value})}
        />
        <input
          placeholder="Stock Mínimo"
          type="number"
          value={nuevoProducto.stock_minimo}
          onChange={e => setNuevoProducto({...nuevoProducto, stock_minimo: e.target.value})}
        />
        <button type="submit">Agregar Producto</button>
      </form>
      <table>
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Precio</th>
            <th>Cantidad</th>
            <th>Stock Mínimo</th>
          </tr>
        </thead>
        <tbody>
          {productos.map(producto => (
            <tr key={producto.id}>
              <td>{producto.nombre}</td>
              <td>${producto.precio}</td>
              <td>{producto.cantidad}</td>
              <td>{producto.stock_minimo}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default Productos