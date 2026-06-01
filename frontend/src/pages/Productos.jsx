import { useState, useEffect } from 'react'
import api from '../services/api'
import { QRCodeSVG } from 'qrcode.react'

function Productos() {
  const [productoEditando, setProductoEditando] = useState(null)
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

  function eliminarProducto(id) {
    api.delete(`/productos/${id}`)
      .then(() => setProductos(productos.filter(p => p.id !== id)))
      .catch(error => console.error(error))
  }

  function guardarEdicion(e) {
    e.preventDefault()
    api.put(`/productos/${productoEditando.id}`, productoEditando)
      .then(response => {
        setProductos(productos.map(p => p.id === productoEditando.id ? response.data : p))
        setProductoEditando(null)
      })
      .catch(error => console.error(error))
  }

  return (
    <div>
      <h1>Productos</h1>

      <form onSubmit={agregarProducto}>
        <input placeholder="Nombre" value={nuevoProducto.nombre}
          onChange={e => setNuevoProducto({...nuevoProducto, nombre: e.target.value})} />
        <input placeholder="Precio" type="number" value={nuevoProducto.precio}
          onChange={e => setNuevoProducto({...nuevoProducto, precio: e.target.value})} />
        <input placeholder="Cantidad" type="number" value={nuevoProducto.cantidad}
          onChange={e => setNuevoProducto({...nuevoProducto, cantidad: e.target.value})} />
        <input placeholder="Stock Mínimo" type="number" value={nuevoProducto.stock_minimo}
          onChange={e => setNuevoProducto({...nuevoProducto, stock_minimo: e.target.value})} />
        <button type="submit">Agregar Producto</button>
      </form>

      {productoEditando && (
        <form onSubmit={guardarEdicion}>
          <h3>Editando: {productoEditando.nombre}</h3>
          <input value={productoEditando.nombre}
            onChange={e => setProductoEditando({...productoEditando, nombre: e.target.value})} />
          <input type="number" value={productoEditando.precio}
            onChange={e => setProductoEditando({...productoEditando, precio: e.target.value})} />
          <input type="number" value={productoEditando.cantidad}
            onChange={e => setProductoEditando({...productoEditando, cantidad: e.target.value})} />
          <input type="number" value={productoEditando.stock_minimo}
            onChange={e => setProductoEditando({...productoEditando, stock_minimo: e.target.value})} />
          <button type="submit">Guardar</button>
          <button type="button" onClick={() => setProductoEditando(null)}>Cancelar</button>
        </form>
      )}

      <table>
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Precio</th>
            <th>Cantidad</th>
            <th>Stock Mínimo</th>
            <th>Acciones</th>
            <th>QR</th>
          </tr>
        </thead>
        <tbody>
          {productos.map(producto => (
            <tr key={producto.id}>
              <td>{producto.nombre}</td>
              <td>${producto.precio}</td>
              <td>{producto.cantidad}</td>
              <td>{producto.stock_minimo}</td>
              <td>
                <button onClick={() => setProductoEditando(producto)}>Editar</button>
                <button onClick={() => eliminarProducto(producto.id)}>Eliminar</button>
              </td>
              <td>{producto.qr_code && (
                  <QRCodeSVG value={producto.qr_code} size={80} />
                   )}
            </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default Productos