import { useState, useEffect } from 'react'
import api from '../services/api'

function Dashboard() {
  const [stats, setStats] = useState({
    totalProductos: 0,
    totalCategorias: 0,
    productosEnAlerta: 0,
    valorTotal: 0,
    productoMasStock: null,
  })
  const [productosCriticos, setProductosCriticos] = useState([])
  const [historial, setHistorial] = useState([])
  const [verMasCriticos, setVerMasCriticos] = useState(false)

  useEffect(() => {
    Promise.all([
      api.get('/productos'),
      api.get('/categorias'),
      api.get('/historial')
    ]).then(([productosRes, categoriasRes, historialRes]) => {
      const productos = productosRes.data.productos
      const categorias = categoriasRes.data.categorias
      const historial = historialRes.data.historial

      const enAlerta = productos.filter(p => p.cantidad < p.stock_minimo)
      const valorTotal = productos.reduce((acc, p) => acc + (p.precio * p.cantidad), 0)
      const masStock = productos.reduce((max, p) => p.cantidad > (max?.cantidad || 0) ? p : max, null)
      const criticos = [...productos].sort((a, b) => (a.cantidad - a.stock_minimo) - (b.cantidad - b.stock_minimo))

      setStats({
        totalProductos: productos.length,
        totalCategorias: categorias.length,
        productosEnAlerta: enAlerta.length,
        valorTotal: valorTotal.toFixed(2),
        productoMasStock: masStock,
      })
      setProductosCriticos(criticos)
      setHistorial(historial.slice(-5).reverse())
    })
  }, [])

  const cards = [
    { label: 'Total Productos', value: stats.totalProductos, color: 'bg-blue-500', icon: '📦' },
    { label: 'Categorías', value: stats.totalCategorias, color: 'bg-indigo-500', icon: '📂' },
    { label: 'Productos en Alerta', value: stats.productosEnAlerta, color: 'bg-red-500', icon: '⚠️' },
    { label: 'Valor del Inventario', value: `$${stats.valorTotal}`, color: 'bg-green-500', icon: '💰' },
  ]

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Dashboard</h1>

      {/* Tarjetas de métricas */}
      <div className="grid grid-cols-4 gap-4 mb-8">
        {cards.map(card => (
          <div key={card.label} className={`${card.color} rounded-xl p-6 text-white`}>
            <div className="text-3xl mb-2">{card.icon}</div>
            <div className="text-3xl font-bold">{card.value}</div>
            <div className="text-sm opacity-80 mt-1">{card.label}</div>
          </div>
        ))}
      </div>

      {stats.productoMasStock && (
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-8">
          <p className="text-blue-700 font-medium">🏆 Producto con más stock: <span className="font-bold">{stats.productoMasStock.nombre}</span> — {stats.productoMasStock.cantidad} unidades</p>
        </div>
      )}

      <div className="grid grid-cols-2 gap-6">
        {/* Productos críticos */}
        <div className="bg-white rounded-xl shadow overflow-hidden">
          <div className="bg-red-600 text-white px-6 py-3">
            <h2 className="font-semibold">📉 Productos Críticos</h2>
          </div>
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-2 text-left text-sm text-gray-600">Producto</th>
                <th className="px-4 py-2 text-left text-sm text-gray-600">Stock</th>
                <th className="px-4 py-2 text-left text-sm text-gray-600">Mínimo</th>
              </tr>
            </thead>
            <tbody>
              {(verMasCriticos ? productosCriticos : productosCriticos.slice(0, 5)).map((p, i) => (
                <tr key={p.id} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                  <td className="px-4 py-2 text-sm font-medium">{p.nombre}</td>
                  <td className="px-4 py-2 text-sm">
                    <span className={`px-2 py-1 rounded-full text-xs ${p.cantidad < p.stock_minimo ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                      {p.cantidad}
                    </span>
                  </td>
                  <td className="px-4 py-2 text-sm text-gray-600">{p.stock_minimo}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {productosCriticos.length > 5 && (
            <div className="px-4 py-3 border-t">
              <button onClick={() => setVerMasCriticos(!verMasCriticos)}
                className="text-blue-600 text-sm hover:underline">
                {verMasCriticos ? 'Ver menos' : `Ver más (${productosCriticos.length - 5} más)`}
              </button>
            </div>
          )}
        </div>

        {/* Últimos movimientos */}
        <div className="bg-white rounded-xl shadow overflow-hidden">
          <div className="bg-blue-600 text-white px-6 py-3">
            <h2 className="font-semibold">📈 Últimos Movimientos</h2>
          </div>
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-2 text-left text-sm text-gray-600">Producto</th>
                <th className="px-4 py-2 text-left text-sm text-gray-600">Acción</th>
                <th className="px-4 py-2 text-left text-sm text-gray-600">Cantidad</th>
              </tr>
            </thead>
            <tbody>
              {historial.map((m, i) => (
                <tr key={m.id} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                  <td className="px-4 py-2 text-sm font-medium">#{m.producto_id}</td>
                  <td className="px-4 py-2 text-sm">
                    <span className={`px-2 py-1 rounded-full text-xs ${m.accion === 'agregar' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                      {m.accion}
                    </span>
                  </td>
                  <td className="px-4 py-2 text-sm text-gray-600">{m.cantidad}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default Dashboard