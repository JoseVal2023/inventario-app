import { useState, useEffect } from 'react'
import api from '../services/api'

function Alertas() {
  const [alertas, setAlertas] = useState([])

  useEffect(() => {
    api.get('/productos')
      .then(response => {
        const productosConAlerta = response.data.productos.filter(
          p => p.cantidad < p.stock_minimo
        )
        setAlertas(productosConAlerta)
      })
      .catch(error => console.error(error))
  }, [])

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 mb-6">⚠️ Alertas de Stock</h1>

      {alertas.length === 0 ? (
        <div className="bg-green-50 border border-green-200 rounded-xl p-8 text-center">
          <p className="text-green-700 text-xl font-medium">✅ Todos los productos tienen stock suficiente</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow overflow-hidden">
          <table className="w-full">
            <thead className="bg-red-600 text-white">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold">Producto</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">Cantidad Actual</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">Stock Mínimo</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">Estado</th>
              </tr>
            </thead>
            <tbody>
              {alertas.map((producto, index) => (
                <tr key={producto.id} className={index % 2 === 0 ? 'bg-red-50' : 'bg-white'}>
                  <td className="px-6 py-4 text-sm text-gray-800 font-medium">{producto.nombre}</td>
                  <td className="px-6 py-4 text-sm">
                    <span className="bg-red-100 text-red-700 px-2 py-1 rounded-full text-xs font-medium">
                      {producto.cantidad}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">{producto.stock_minimo}</td>
                  <td className="px-6 py-4 text-sm">
                    <span className="bg-red-100 text-red-700 px-2 py-1 rounded-full text-xs font-medium">
                      ⚠️ Stock bajo
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

export default Alertas