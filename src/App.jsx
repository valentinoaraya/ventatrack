import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import SideBar from './components/SideBar/SideBar.jsx'
import Vender from './components/Vender/Vender.jsx'
import Productos from './components/Productos/Productos.jsx'
import Historial from './components/Historial/Historial.jsx'

function App() {

  return (
    <BrowserRouter>
      <div className='app'>
        <SideBar></SideBar>
        <div className='content'>
          <Routes>
            <Route path='/' element={<Vender />} />
            <Route path='/productos' element={<Productos />} />
            <Route path='/historial' element={<Historial />} />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  )
}

export default App
