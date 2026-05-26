import { useState, useEffect } from 'react'
import api from '../services/api'

function Productos() {
  const [productos, setProductos] = useState([])

  useEffect(() => {
    api.get('/productos')
      .then(response => setProductos(response.data.productos))
      .catch(error => console.error(error))
  }, [])

 return (
    <div>
      <h1>Productos</h1>
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