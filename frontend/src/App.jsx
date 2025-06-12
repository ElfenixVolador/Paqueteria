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
import Home from './pages/Home';

import RequireAuth from './componentes/RequireAuth';
import RequireAdmin from './componentes/RequireAdmin'; // ✅ NUEVO
import LayoutPrivado from './componentes/LayoutPrivado';

import Roles from './pages/Roles'; // ✅ NUEVO

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Rutas públicas */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/" element={<Navigate to="/login" replace />} />

        {/* Rutas protegidas */}
        <Route element={<RequireAuth />}>
          <Route element={<LayoutPrivado />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/home" element={<Home />} />
            <Route path="/registropaq" element={<RegistroPaq />} />
            <Route path="/seguimiento" element={<Seguimiento />} />
            <Route path="/notificaciones" element={<Notificaciones />} />
            <Route path="/usuarios" element={<Usuarios />} />
            <Route path="/reporte" element={<Reporte />} />

            {/*Ruta exclusiva para admin */}
            <Route
              path="/roles"
              element={
                <RequireAdmin>
                  <Roles />
                </RequireAdmin>
              }
            />
          </Route>
        </Route>

        {/* Redirección por defecto */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
