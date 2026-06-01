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

  const inputClass = "border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Productos</h1>

      <div className="bg-white rounded-xl shadow p-6 mb-6">
        <h2 className="text-lg font-semibold text-gray-700 mb-4">Agregar Producto</h2>
        <form onSubmit={agregarProducto} className="flex flex-wrap gap-3">
          <input className={inputClass} placeholder="Nombre" value={nuevoProducto.nombre}
            onChange={e => setNuevoProducto({...nuevoProducto, nombre: e.target.value})} />
          <input className={inputClass} placeholder="Precio" type="number" value={nuevoProducto.precio}
            onChange={e => setNuevoProducto({...nuevoProducto, precio: e.target.value})} />
          <input className={inputClass} placeholder="Cantidad" type="number" value={nuevoProducto.cantidad}
            onChange={e => setNuevoProducto({...nuevoProducto, cantidad: e.target.value})} />
          <input className={inputClass} placeholder="Stock Mínimo" type="number" value={nuevoProducto.stock_minimo}
            onChange={e => setNuevoProducto({...nuevoProducto, stock_minimo: e.target.value})} />
          <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium">
            Agregar
          </button>
        </form>
      </div>

      {productoEditando && (
        <div className="bg-blue-50 border border-blue-200 rounded-xl shadow p-6 mb-6">
          <h2 className="text-lg font-semibold text-blue-700 mb-4">Editando: {productoEditando.nombre}</h2>
          <form onSubmit={guardarEdicion} className="flex flex-wrap gap-3">
            <input className={inputClass} value={productoEditando.nombre}
              onChange={e => setProductoEditando({...productoEditando, nombre: e.target.value})} />
            <input className={inputClass} type="number" value={productoEditando.precio}
              onChange={e => setProductoEditando({...productoEditando, precio: e.target.value})} />
            <input className={inputClass} type="number" value={productoEditando.cantidad}
              onChange={e => setProductoEditando({...productoEditando, cantidad: e.target.value})} />
            <input className={inputClass} type="number" value={productoEditando.stock_minimo}
              onChange={e => setProductoEditando({...productoEditando, stock_minimo: e.target.value})} />
            <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium">
              Guardar
            </button>
            <button type="button" onClick={() => setProductoEditando(null)}
              className="bg-gray-200 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-300 transition-colors font-medium">
              Cancelar
            </button>
          </form>
        </div>
      )}

      <div className="bg-white rounded-xl shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-blue-600 text-white">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-semibold">Nombre</th>
              <th className="px-6 py-3 text-left text-sm font-semibold">Precio</th>
              <th className="px-6 py-3 text-left text-sm font-semibold">Cantidad</th>
              <th className="px-6 py-3 text-left text-sm font-semibold">Stock Mínimo</th>
              <th className="px-6 py-3 text-left text-sm font-semibold">QR</th>
              <th className="px-6 py-3 text-left text-sm font-semibold">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {productos.map((producto, index) => (
              <tr key={producto.id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                <td className="px-6 py-4 text-sm text-gray-800 font-medium">{producto.nombre}</td>
                <td className="px-6 py-4 text-sm text-gray-600">${producto.precio}</td>
                <td className="px-6 py-4 text-sm">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    producto.cantidad < producto.stock_minimo
                      ? 'bg-red-100 text-red-700'
                      : 'bg-green-100 text-green-700'
                  }`}>
                    {producto.cantidad}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">{producto.stock_minimo}</td>
                <td className="px-6 py-4">
                  {producto.qr_code && <QRCodeSVG value={producto.qr_code} size={60} />}
                </td>
                <td className="px-6 py-4">
                  <div className="flex gap-2">
                    <button onClick={() => setProductoEditando(producto)}
                      className="bg-blue-100 text-blue-700 px-3 py-1 rounded-lg text-sm hover:bg-blue-200 transition-colors">
                      Editar
                    </button>
                    <button onClick={() => eliminarProducto(producto.id)}
                      className="bg-red-100 text-red-700 px-3 py-1 rounded-lg text-sm hover:bg-red-200 transition-colors">
                      Eliminar
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default Productos