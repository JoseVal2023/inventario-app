import { useState, useEffect } from 'react'
import api from '../services/api'

function Usuarios() {
  const [usuarios, setUsuarios] = useState([])
  const [nuevoUsuario, setNuevoUsuario] = useState({
    nombre: '',
    email: '',
    contrasena: '',
    rol: 'usuario'
  })
  const [mensaje, setMensaje] = useState('')

  useEffect(() => {
    api.get('/usuarios')
      .then(response => setUsuarios(response.data.usuarios))
      .catch(error => console.error(error))
  }, [])

  function crearUsuario(e) {
    e.preventDefault()
    api.post('/usuarios', nuevoUsuario)
      .then(response => {
        if (response.data.error) {
          setMensaje(response.data.error)
          return
        }
        setMensaje('Usuario creado correctamente')
        setNuevoUsuario({ nombre: '', email: '', contrasena: '', rol: 'usuario' })
        api.get('/usuarios').then(r => setUsuarios(r.data.usuarios))
      })
      .catch(error => console.error(error))
  }

  function eliminarUsuario(id) {
    const usuarioActual = JSON.parse(atob(localStorage.getItem('token').split('.')[1]))

    if (usuarioActual.id === id) {
      if (window.confirm('Estás eliminando tu propia cuenta. Se cerrará la sesión automáticamente. ¿Continuar?')) {
        api.delete(`/usuarios/${id}`)
          .then(() => {
            localStorage.removeItem('token')
            localStorage.removeItem('rol')
            localStorage.removeItem('nombre')
            window.location.reload()
          })
          .catch(error => console.error(error))
      }
      return
    }

    api.delete(`/usuarios/${id}`)
      .then(() => setUsuarios(usuarios.filter(u => u.id !== id)))
      .catch(error => console.error(error))
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Gestión de Usuarios</h1>

      <div className="bg-white rounded-xl shadow p-6 mb-6">
        <h2 className="text-lg font-semibold text-gray-700 mb-4">Crear Usuario</h2>
        <form onSubmit={crearUsuario} className="flex flex-wrap gap-3">
          <input
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Nombre"
            value={nuevoUsuario.nombre}
            onChange={e => setNuevoUsuario({...nuevoUsuario, nombre: e.target.value})}
          />
          <input
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Email"
            type="email"
            value={nuevoUsuario.email}
            onChange={e => setNuevoUsuario({...nuevoUsuario, email: e.target.value})}
          />
          <input
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Contraseña"
            type="password"
            value={nuevoUsuario.contrasena}
            onChange={e => setNuevoUsuario({...nuevoUsuario, contrasena: e.target.value})}
          />
          <select
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={nuevoUsuario.rol}
            onChange={e => setNuevoUsuario({...nuevoUsuario, rol: e.target.value})}
          >
            <option value="usuario">Usuario</option>
            <option value="admin">Administrador</option>
          </select>
          <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium">
            Crear Usuario
          </button>
        </form>
        {mensaje && <p className="mt-3 text-green-600 text-sm font-medium">{mensaje}</p>}
      </div>

      <div className="bg-white rounded-xl shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-blue-600 text-white">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-semibold">Nombre</th>
              <th className="px-6 py-3 text-left text-sm font-semibold">Email</th>
              <th className="px-6 py-3 text-left text-sm font-semibold">Rol</th>
              <th className="px-6 py-3 text-left text-sm font-semibold">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {usuarios.map((usuario, index) => (
              <tr key={usuario.id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                <td className="px-6 py-4 text-sm text-gray-800 font-medium">{usuario.nombre}</td>
                <td className="px-6 py-4 text-sm text-gray-600">{usuario.email}</td>
                <td className="px-6 py-4 text-sm">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    usuario.rol === 'admin' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700'
                  }`}>
                    {usuario.rol}
                  </span>
                </td>
                <td className="px-6 py-4">
                  {localStorage.getItem('rol') === 'admin' && (
                    <button onClick={() => eliminarUsuario(usuario.id)}
                      className="bg-red-100 text-red-700 px-3 py-1 rounded-lg text-sm hover:bg-red-200 transition-colors">
                      Eliminar
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default Usuarios