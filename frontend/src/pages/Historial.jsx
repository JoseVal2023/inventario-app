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
      <h1>Historial de Movimientos</h1>
      <table>
        <thead>
          <tr>
            <th>Producto ID</th>
            <th>Acción</th>
            <th>Cantidad</th>
            <th>Origen</th>
            <th>Fecha</th>
          </tr>
        </thead>
        <tbody>
          {historial.map(movimiento => (
            <tr key={movimiento.id}>
              <td>{movimiento.producto_id}</td>
              <td>{movimiento.accion}</td>
              <td>{movimiento.cantidad}</td>
              <td>{movimiento.origen}</td>
              <td>{new Date(movimiento.fecha).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default Historial