import React, { useState } from 'react';
import { FaDownload } from 'react-icons/fa';

const Reporte = () => {
  const [parametros, setParametros] = useState({
    fechaInicio: '',
    fechaFin: '',
    tipo: 'Resumen General',
    formato: 'PDF',
    departamento: 'Todos',
    empresa: 'Todas',
    estado: 'Todos'
  });

  const reportesGuardados = [
    { nombre: 'Resumen Mensual Abril 2025', tipo: 'Resumen General', fecha: '15/04/2025' },
    { nombre: 'Desglose por Departamentos Q1 2025', tipo: 'Por Departamento', fecha: '01/04/2025' },
    { nombre: 'Análisis de Tiempos de Entrega', tipo: 'Detalle por Paquete', fecha: '15/03/2025' },
    { nombre: 'Comparativo por Empresas de Paquetería', tipo: 'Por Empresa', fecha: '28/02/2025' },
  ];

  const handleChange = e => setParametros({ ...parametros, [e.target.name]: e.target.value });
  const resetear = () => setParametros({ fechaInicio: '', fechaFin: '', tipo: 'Resumen General', formato: 'PDF', departamento: 'Todos', empresa: 'Todas', estado: 'Todos' });

  return (
    <div className="p-6 space-y-8 max-w-6xl mx-auto">
      <div className="bg-white p-4 rounded shadow">
        <h2 className="text-xl font-bold mb-4">Generación de Reportes</h2>

        <div className="grid md:grid-cols-3 gap-4 mb-4">
          <div>
            <label className="text-sm font-medium">Rango de Fechas</label>
            <input type="date" name="fechaInicio" value={parametros.fechaInicio} onChange={handleChange} className="w-full border px-3 py-2 rounded mt-1" />
            <input type="date" name="fechaFin" value={parametros.fechaFin} onChange={handleChange} className="w-full border px-3 py-2 rounded mt-2" />
          </div>

          <div>
            <label className="text-sm font-medium">Tipo de Reporte</label>
            <select name="tipo" value={parametros.tipo} onChange={handleChange} className="w-full border px-3 py-2 rounded mt-1">
              <option>Resumen General</option>
              <option>Por Departamento</option>
              <option>Por Empresa</option>
              <option>Detalle por Paquete</option>
            </select>
          </div>

          <div>
            <label className="text-sm font-medium">Formato</label>
            <select name="formato" value={parametros.formato} onChange={handleChange} className="w-full border px-3 py-2 rounded mt-1">
              <option>PDF</option>
              <option>Excel</option>
            </select>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-4 mb-4">
          <div>
            <label className="text-sm font-medium">Departamento</label>
            <select name="departamento" value={parametros.departamento} onChange={handleChange} className="w-full border px-3 py-2 rounded mt-1">
              <option>Todos</option>
              <option>Contabilidad</option>
              <option>RRHH</option>
              <option>IT</option>
              <option>Marketing</option>
              <option>Operaciones</option>
            </select>
          </div>
          <div>
            <label className="text-sm font-medium">Empresa de Paquetería</label>
            <select name="empresa" value={parametros.empresa} onChange={handleChange} className="w-full border px-3 py-2 rounded mt-1">
              <option>Todas</option>
              <option>DHL</option>
              <option>FedEx</option>
              <option>Estafeta</option>
              <option>UPS</option>
            </select>
          </div>
          <div>
            <label className="text-sm font-medium">Estado</label>
            <select name="estado" value={parametros.estado} onChange={handleChange} className="w-full border px-3 py-2 rounded mt-1">
              <option>Todos</option>
              <option>Pendiente</option>
              <option>En tránsito</option>
              <option>Entregado</option>
              <option>Recibido</option>
            </select>
          </div>
        </div>

        <div className="flex justify-between items-center">
          <button onClick={resetear} className="px-4 py-2 rounded border">Restablecer</button>
          <button className="bg-blue-600 text-white px-4 py-2 rounded flex items-center gap-2">
            <FaDownload /> Generar Reporte
          </button>
        </div>
      </div>

      <div className="bg-white p-4 rounded shadow text-center text-gray-500">
        <p className="text-sm">Selecciona los parámetros y genera un reporte para ver la vista previa</p>
      </div>

      <div className="bg-white p-4 rounded shadow">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold">Reportes Guardados</h2>
          <button className="bg-green-600 text-white px-4 py-2 rounded text-sm flex items-center gap-2">
            <FaDownload /> Descargar Reporte
          </button>
        </div>
        <table className="w-full text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="text-left px-4 py-2">NOMBRE</th>
              <th className="text-left px-4 py-2">TIPO</th>
              <th className="text-left px-4 py-2">FECHA</th>
            </tr>
          </thead>
          <tbody>
            {reportesGuardados.map((r, i) => (
              <tr key={i} className="hover:bg-gray-50">
                <td className="px-4 py-2 text-blue-700 font-medium">{r.nombre}</td>
                <td className="px-4 py-2">{r.tipo}</td>
                <td className="px-4 py-2">{r.fecha}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Reporte;