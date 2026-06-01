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
      <h1>⚠️ Alertas de Stock</h1>
      {alertas.length === 0 ? (
        <p>✅ Todos los productos tienen stock suficiente</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Producto</th>
              <th>Cantidad Actual</th>
              <th>Stock Mínimo</th>
            </tr>
          </thead>
          <tbody>
            {alertas.map(producto => (
              <tr key={producto.id} style={{backgroundColor: 'red', color: 'white'}}>
                <td>{producto.nombre}</td>
                <td>{producto.cantidad}</td>
                <td>{producto.stock_minimo}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}

export default Alertas
