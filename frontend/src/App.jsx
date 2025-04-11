import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Register from './pages/Register';
import Login from './pages/Login';
import RegistroPaq from './pages/RegistroPaq'; // Asegúrate de que la ruta sea correcta

function App() {
  
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/register' element={<Register />} />
        <Route path='/login' element={<Login />} />
        <Route path='/registropaq' element={<RegistroPaq />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
