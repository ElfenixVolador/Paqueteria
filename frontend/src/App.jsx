import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import RegistroPaq from './pages/RegistroPaq';
import Seguimiento from './pages/Seguimiento';
import Notificaciones from './pages/Notificaciones';
import Usuarios from './pages/Usuarios';
import Reporte from './pages/Reporte';
import RequireAuth from './componentes/RequireAuth';
import LayoutPrivado from './componentes/LayoutPrivado';
import Home from './pages/Home';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Rutas públicas */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Redirección raíz directa al login */}
        <Route path="/" element={<Navigate to="/login" replace />} />

        {/* Rutas protegidas con layout privado */}
        <Route element={<RequireAuth />}>
          <Route element={<LayoutPrivado />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/home" element={<Home />} />
            <Route path="/registropaq" element={<RegistroPaq />} />
            <Route path="/seguimiento" element={<Seguimiento />} />
            <Route path="/notificaciones" element={<Notificaciones />} />
            <Route path="/usuarios" element={<Usuarios />} />
            <Route path="/reporte" element={<Reporte />} />
          </Route>
        </Route>

        {/* Ruta inválida → login */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
