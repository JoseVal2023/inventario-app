import { useState, useEffect } from 'react'
import api from '../services/api'

function Historial() {
  const [historial, setHistorial] = useState([])

  useEffect(() => {
    api.get('/historial')
      .then(response => setHistorial(response.data.historial))
      .catch(error => console.error(error))
  }, [])

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Historial de Movimientos</h1>

      <div className="bg-white rounded-xl shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-blue-600 text-white">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-semibold">Producto ID</th>
              <th className="px-6 py-3 text-left text-sm font-semibold">Acción</th>
              <th className="px-6 py-3 text-left text-sm font-semibold">Cantidad</th>
              <th className="px-6 py-3 text-left text-sm font-semibold">Origen</th>
              <th className="px-6 py-3 text-left text-sm font-semibold">Fecha</th>
            </tr>
          </thead>
          <tbody>
            {historial.map((movimiento, index) => (
              <tr key={movimiento.id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                <td className="px-6 py-4 text-sm text-gray-800">{movimiento.producto_id}</td>
                <td className="px-6 py-4 text-sm">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    movimiento.accion === 'agregar'
                      ? 'bg-green-100 text-green-700'
                      : 'bg-red-100 text-red-700'
                  }`}>
                    {movimiento.accion}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">{movimiento.cantidad}</td>
                <td className="px-6 py-4 text-sm text-gray-600">{movimiento.origen}</td>
                <td className="px-6 py-4 text-sm text-gray-600">
                  {new Date(movimiento.fecha).toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default Historial