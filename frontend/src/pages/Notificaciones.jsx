// Notificaciones.jsx - configuración de alertas estilo PackTrack

import React, { useState } from 'react';
import { FaToggleOn, FaToggleOff } from 'react-icons/fa';

const Notificaciones = () => {
  const [preferencias, setPreferencias] = useState({
    email: true,
    sms: false,
    app: true
  });

  const [eventos, setEventos] = useState({
    recibidos: true,
    transito: true,
    entregados: true,
    pendientes: false,
    retraso: false
  });

  const [departamentos, setDepartamentos] = useState({
    contabilidad: true,
    rrhh: false,
    it: true,
    marketing: true,
    operaciones: true
  });

  const historial = [
    { fecha: '15/04/2025 14:35', tipo: 'Email', mensaje: 'Nuevo paquete #74521896 recibido para Dep. Contabilidad', estado: 'Enviado' },
    { fecha: '15/04/2025 14:10', tipo: 'App', mensaje: 'Paquete #73265189 marcado como entregado a Dep. IT', estado: 'Entregado' },
    { fecha: '14/04/2025 16:45', tipo: 'Email', mensaje: 'Paquete #74125368 en tránsito hacia Dep. Marketing', estado: 'Enviado' },
    { fecha: '14/04/2025 11:20', tipo: 'SMS', mensaje: 'Paquete #73589621 en estado pendiente para Dep. Operaciones', estado: 'Pendiente' },
    { fecha: '13/04/2025 09:15', tipo: 'App', mensaje: 'Paquete #72965874 entregado a Dep. RRHH', estado: 'Entregado' }
  ];

  const toggle = (group, key) => {
    if (group === 'preferencias') setPreferencias(p => ({ ...p, [key]: !p[key] }));
    if (group === 'eventos') setEventos(p => ({ ...p, [key]: !p[key] }));
    if (group === 'departamentos') setDepartamentos(p => ({ ...p, [key]: !p[key] }));
  };

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold text-blue-900 mb-6">Configuración de Notificaciones</h1>

      <section className="mb-6 bg-white p-4 rounded shadow">
        <h2 className="text-lg font-semibold mb-4">Preferencias de Alertas</h2>
        {[
          { key: 'email', label: 'Notificaciones por Email', desc: 'Recibir alertas en tu correo electrónico' },
          { key: 'sms', label: 'Notificaciones por SMS', desc: 'Recibir alertas en tu teléfono móvil' },
          { key: 'app', label: 'Notificaciones en la Aplicación', desc: 'Ver alertas dentro del sistema' }
        ].map(({ key, label, desc }) => (
          <div key={key} className="flex items-center justify-between border-b py-2">
            <div>
              <p className="font-medium">{label}</p>
              <p className="text-sm text-gray-600">{desc}</p>
            </div>
            <button onClick={() => toggle('preferencias', key)}>
              {preferencias[key] ? <FaToggleOn className="text-blue-500 text-2xl" /> : <FaToggleOff className="text-gray-400 text-2xl" />}
            </button>
          </div>
        ))}
      </section>

      <section className="mb-6 bg-white p-4 rounded shadow">
        <h2 className="text-lg font-semibold mb-4">Datos de Contacto</h2>
        <label className="block mb-2 text-sm">Correo Electrónico</label>
        <input type="email" className="border px-3 py-2 mb-4 w-full rounded" defaultValue="admin@empresa.com" />
        <label className="block mb-2 text-sm">Teléfono Móvil</label>
        <input type="tel" className="border px-3 py-2 w-full rounded" placeholder="+52 (55) 1234 5678" />
      </section>

      <section className="mb-6 bg-white p-4 rounded shadow">
        <h2 className="text-lg font-semibold mb-4">Eventos de Notificación</h2>
        {[
          { key: 'recibidos', label: 'Nuevos paquetes recibidos' },
          { key: 'transito', label: 'Paquetes en tránsito' },
          { key: 'entregados', label: 'Paquetes entregados' },
          { key: 'pendientes', label: 'Paquetes pendientes' },
          { key: 'retraso', label: 'Paquetes con retraso' }
        ].map(({ key, label }) => (
          <label key={key} className="block mb-2">
            <input type="checkbox" checked={eventos[key]} onChange={() => toggle('eventos', key)} className="mr-2" />
            {label}
          </label>
        ))}
      </section>

      <section className="mb-6 bg-white p-4 rounded shadow">
        <h2 className="text-lg font-semibold mb-4">Filtros por Departamentos</h2>
        {Object.entries(departamentos).map(([key, val]) => (
          <label key={key} className="inline-block mr-4 mb-2">
            <input type="checkbox" checked={val} onChange={() => toggle('departamentos', key)} className="mr-2" />
            {key.charAt(0).toUpperCase() + key.slice(1)}
          </label>
        ))}
      </section>

      <div className="flex justify-between gap-4 mb-8">
        <button className="bg-gray-200 text-gray-700 px-4 py-2 rounded">Restablecer Valores Predeterminados</button>
        <button className="bg-blue-600 text-white px-4 py-2 rounded">Guardar Configuración</button>
      </div>

      <section className="bg-white p-4 rounded shadow">
        <h2 className="text-lg font-semibold mb-4">Historial de Notificaciones</h2>
        <table className="w-full text-sm border">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              <th className="border px-3 py-2">FECHA Y HORA</th>
              <th className="border px-3 py-2">TIPO</th>
              <th className="border px-3 py-2">MENSAJE</th>
              <th className="border px-3 py-2">ESTADO</th>
            </tr>
          </thead>
          <tbody>
            {historial.map((n, i) => (
              <tr key={i} className="hover:bg-gray-50">
                <td className="border px-3 py-2">{n.fecha}</td>
                <td className="border px-3 py-2">
                  <span className={`px-2 py-1 rounded text-white text-xs font-semibold ${n.tipo === 'Email' ? 'bg-blue-500' : n.tipo === 'SMS' ? 'bg-purple-500' : 'bg-green-500'}`}>{n.tipo}</span>
                </td>
                <td className="border px-3 py-2">{n.mensaje}</td>
                <td className="border px-3 py-2">
                  <span className={`text-xs font-semibold px-2 py-1 rounded ${n.estado === 'Enviado' ? 'bg-green-100 text-green-700' : n.estado === 'Pendiente' ? 'bg-yellow-100 text-yellow-700' : 'bg-green-200 text-green-800'}`}>{n.estado}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
};

export default Notificaciones;
