import React, { useState, useEffect } from 'react';
import { FaFilter } from 'react-icons/fa';
import { getAllSeguimientos, getResumenEstados } from '../services/seguimientoService';

const Seguimiento = () => {
  const [filtroGuia, setFiltroGuia] = useState('');
  const [paginaActual, setPaginaActual] = useState(1);
  const [paquetes, setPaquetes] = useState([]);
  const [resumenEstados, setResumenEstados] = useState([]);

  const resultadosPorPagina = 5;

  useEffect(() => {
    async function fetchData() {
      try {
        const resPaquetes = await getAllSeguimientos();
        setPaquetes(resPaquetes.data);

        const resResumen = await getResumenEstados();
        setResumenEstados(resResumen.data);
      } catch (err) {
        console.error('Error al cargar datos:', err);
      }
    }
    fetchData();
  }, []);

  const paquetesFiltrados = paquetes.filter(p => p.numero_guia.includes(filtroGuia));
  const totalPaginas = Math.ceil(paquetesFiltrados.length / resultadosPorPagina);
  const paquetesPagina = paquetesFiltrados.slice(
    (paginaActual - 1) * resultadosPorPagina,
    paginaActual * resultadosPorPagina
  );

  const obtenerClaseEstado = (estado) => {
    switch ((estado || '').toLowerCase()) {
      case 'registrado': return 'bg-gray-200 text-gray-800';
      case 'pendiente': return 'bg-red-200 text-red-800';
      case 'en tránsito': return 'bg-blue-200 text-blue-800';
      case 'entregado': return 'bg-green-200 text-green-800';
      case 'recibido': return 'bg-yellow-200 text-yellow-800';
      default: return 'bg-gray-200 text-gray-800';
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-2xl font-bold text-blue-900 mb-6">Seguimiento de Paquetes</h1>

      <div className="flex flex-wrap items-center gap-4 mb-6">
        <input
          type="text"
          placeholder="Buscar por # guía"
          value={filtroGuia}
          onChange={e => setFiltroGuia(e.target.value)}
          className="border border-gray-300 rounded-md px-4 py-2 w-64"
        />
        <button className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-md">
          <FaFilter /> Aplicar Filtros
        </button>
      </div>

      <table className="w-full text-sm border mb-6">
        <thead className="bg-gray-100 text-gray-700">
          <tr>
            <th className="border px-3 py-2"># GUÍA</th>
            <th className="border px-3 py-2">REMITENTE</th>
            <th className="border px-3 py-2">DESTINATARIO</th>
            <th className="border px-3 py-2">EMPRESA</th>
            <th className="border px-3 py-2">FECHA</th>
            <th className="border px-3 py-2">ESTADO</th>
          </tr>
        </thead>
        <tbody>
          {paquetesPagina.map((p, i) => (
            <tr key={i} className="hover:bg-gray-50">
              <td className="border px-3 py-2 font-semibold text-blue-600">{p.numero_guia}</td>
              <td className="border px-3 py-2">{p.remitente}</td>
              <td className="border px-3 py-2">{p.destinatario}</td>
              <td className="border px-3 py-2">{p.empresa_paqueteria}</td>
              <td className="border px-3 py-2">{new Date(p.create_time).toLocaleDateString()}</td>
              <td className="border px-3 py-2">
                <span className={`px-2 py-1 rounded text-xs font-semibold ${obtenerClaseEstado(p.estado)}`}>
                  {p.estado || 'Pendiente'}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="flex justify-between items-center mb-8">
        <span className="text-sm text-gray-600">
          Mostrando {((paginaActual - 1) * resultadosPorPagina) + 1} a {paginaActual * resultadosPorPagina} de {paquetesFiltrados.length} resultados
        </span>
        <div className="flex items-center gap-2">
          <button disabled={paginaActual === 1} onClick={() => setPaginaActual(p => p - 1)} className="px-2 py-1 border rounded">Anterior</button>
          {[...Array(totalPaginas).keys()].map(n => (
            <button
              key={n}
              onClick={() => setPaginaActual(n + 1)}
              className={`px-2 py-1 border rounded ${paginaActual === n + 1 ? 'bg-blue-600 text-white' : ''}`}
            >{n + 1}</button>
          ))}
          <button disabled={paginaActual === totalPaginas} onClick={() => setPaginaActual(p => p + 1)} className="px-2 py-1 border rounded">Siguiente</button>
        </div>
      </div>
    </div>
  );
};

export default Seguimiento;
