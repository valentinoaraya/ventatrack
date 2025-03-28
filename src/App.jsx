import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import SideBar from './components/SideBar/SideBar.jsx'
import Vender from './components/Vender/Vender.jsx'
import Productos from './components/Productos/Productos.jsx'
import Historial from './components/Historial/Historial.jsx'
import { useEffect, useState } from 'react'
import { authListener, login, logout } from './services/firebase-auth.js'
import { ToastContainer } from 'react-toastify'
import { notifyError } from './utils/notifications.js'

function App() {

  const [user, setUser] = useState(null)
  const [dataUser, setDataUser] = useState({
    username: "",
    password: ""
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsuscribe = authListener((currentUser) => {
      setUser(currentUser)
      setLoading(false)
    })

    return () => unsuscribe()
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    const response = await login(dataUser.username, dataUser.password)

    if (!response) notifyError("Error al iniciar sesión.")
  }

  const hanldeChange = (e) => {
    setDataUser({
      ...dataUser,
      [e.target.name]: e.target.value
    })
  }

  if (loading) return <div className='app'>
    <div className='divLoginContainer'>
      <h1>Cargando...</h1>
    </div>
  </div>

  return (
    <BrowserRouter>
      <div className='divAdvertencia'>
        <p>
          Esta es una versión de prueba de la aplicación.
          Esta version utiliza una base de datos con algunos productos y ventas solo para demostración.
          No podrás realizar operaciones de escritura en la base de datos.
        </p>
      </div>
      <div className='app'>
        <ToastContainer />
        {
          user ?
            <>
              <SideBar></SideBar>
              <div className='content'>
                <Routes>
                  <Route path='/' element={<Vender />} />
                  <Route path='/productos' element={<Productos />} />
                  <Route path='/historial' element={<Historial />} />
                </Routes>
              </div>
            </>
            :
            <div className='divLoginContainer'>
              <div className='divLogin'>
                <h1>Iniciar sesión</h1>
                <form onSubmit={handleSubmit} className='formLogin'>
                  <div className='divInputContainer'>
                    <label>Usuario: </label>
                    <input
                      className='inputLogin'
                      type="text"
                      name='username'
                      onChange={hanldeChange}
                      required
                    />
                  </div>
                  <div className='divInputContainer'>
                    <label>Contraseña: </label>
                    <input
                      className='inputLogin'
                      type="password"
                      name='password'
                      onChange={hanldeChange}
                      required
                    />
                  </div>
                  <button className='buttonLogin' type='submit'>Iniciar sesión</button>
                </form>
              </div>
            </div>
        }
      </div>
    </BrowserRouter>
  )
}

export default App
