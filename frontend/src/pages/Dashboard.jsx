import React, { useState, useEffect } from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import {
  FaCheckCircle, FaClock, FaUserPlus, FaTruck, FaPlusCircle
} from 'react-icons/fa';
import { getResumen, getGraficaSeguimiento } from '../services/dashboardService';
import Protegido from '../componentes/Protegido'; // Importamos el componente de protección

const Dashboard = () => {
  const [dias, setDias] = useState(7);
  const [resumen, setResumen] = useState({
    totalPaquetes: 0,
    paquetesHoy: 0,
    entregados: 0,
    pendientes: 0
  });
  const [graficaData, setGraficaData] = useState([]);

  useEffect(() => {
    getResumen()
      .then(setResumen)
      .catch(err => console.error("Error al cargar resumen:", err));
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { recibidos, entregados } = await getGraficaSeguimiento();

        const fechas = Array.from(new Set([
          ...recibidos.map(r => r.fecha),
          ...entregados.map(e => e.fecha)
        ])).sort();

        const merged = fechas.map(fecha => ({
          fecha,
          recibidos: recibidos.find(r => r.fecha === fecha)?.cantidad || 0,
          entregados: entregados.find(e => e.fecha === fecha)?.cantidad || 0
        }));

        const dataFiltrada = merged.slice(-dias);
        setGraficaData(dataFiltrada);
      } catch (error) {
        console.error("Error al cargar gráfica:", error);
      }
    };

    fetchData();
  }, [dias]);

  const actividades = [
    { icon: <FaPlusCircle className="text-blue-500" />, titulo: 'Nuevo paquete registrado', detalle: 'Guía: #74521896 - DHL', tiempo: 'Hace 10 minutos' },
    { icon: <FaCheckCircle className="text-green-500" />, titulo: 'Paquete entregado', detalle: 'Guía: #73265189 - FedEx', tiempo: 'Hace 35 minutos' },
    { icon: <FaTruck className="text-yellow-500" />, titulo: 'Paquete en tránsito', detalle: 'Guía: #74125368 - UPS', tiempo: 'Hace 1 hora' },
    { icon: <FaUserPlus className="text-purple-500" />, titulo: 'Nuevo usuario creado', detalle: 'Juan Pérez (Recepción)', tiempo: 'Hace 2 horas' }
  ];

  const paquetesRecientes = [
    { guia: '#74521896', remitente: 'Suministros SA', destinatario: 'Dep. Contabilidad', fecha: '15/04/2025', estado: 'Recibido' },
    { guia: '#73265189', remitente: 'TechCorp Inc.', destinatario: 'Dep. IT', fecha: '15/04/2025', estado: 'Entregado' },
    { guia: '#74125368', remitente: 'Innovadores SRL', destinatario: 'Dep. Marketing', fecha: '14/04/2025', estado: 'En tránsito' },
    { guia: '#73589621', remitente: 'Constructora ABC', destinatario: 'Dep. Operaciones', fecha: '13/04/2025', estado: 'Pendiente' },
  ];

  const estadoColor = {
    Recibido: 'bg-yellow-200 text-yellow-700',
    Entregado: 'bg-green-200 text-green-700',
    'En tránsito': 'bg-blue-200 text-blue-700',
    Pendiente: 'bg-red-200 text-red-700'
  };

  return (
    <Protegido modulo="dashboard" accion="ver">
      <div className="p-6 space-y-8">
        {/* Tarjetas resumen */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <CardResumen titulo="Total Paquetes" valor={resumen.totalPaquetes} color="bg-blue-500" />
          <CardResumen titulo="Recibidos Hoy" valor={resumen.paquetesHoy} color="bg-green-500" />
          <CardResumen titulo="Entregados" valor={resumen.entregados} color="bg-purple-500" />
          <CardResumen titulo="Pendientes" valor={resumen.pendientes} color="bg-red-500" />
        </div>

        {/* Gráfico */}
        <div className="bg-white p-4 rounded shadow">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold">Paquetes por día</h2>
            <div className="space-x-2">
              {[7, 30, 90].map(d => (
                <button
                  key={d}
                  onClick={() => setDias(d)}
                  className={`text-sm px-3 py-1 rounded ${dias === d ? 'bg-blue-600 text-white' : 'bg-gray-100'}`}
                >
                  {d} días
                </button>
              ))}
            </div>
          </div>

          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={graficaData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="fecha" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="recibidos" stroke="#facc15" name="Recibidos" />
              <Line type="monotone" dataKey="entregados" stroke="#10b981" name="Entregados" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Actividad reciente */}
        <div className="bg-white p-4 rounded shadow">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold">Actividad Reciente</h2>
            <a href="#" className="text-sm text-blue-600">Ver todas las actividades</a>
          </div>
          <ul className="space-y-3">
            {actividades.map((a, i) => (
              <li key={i} className="flex items-start gap-3">
                <span className="mt-1">{a.icon}</span>
                <div>
                  <p className="font-medium text-sm text-gray-800">{a.titulo}</p>
                  <p className="text-sm text-gray-500">{a.detalle}</p>
                  <p className="text-xs text-gray-400">{a.tiempo}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* Paquetes recientes */}
        <div className="bg-white p-4 rounded shadow">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold">Paquetes Recientes</h2>
            <a href="#" className="text-sm text-blue-600">Ver todos</a>
          </div>
          <table className="w-full text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="text-left px-4 py-2"># GUÍA</th>
                <th className="text-left px-4 py-2">REMITENTE</th>
                <th className="text-left px-4 py-2">DESTINATARIO</th>
                <th className="text-left px-4 py-2">FECHA</th>
                <th className="text-left px-4 py-2">ESTADO</th>
              </tr>
            </thead>
            <tbody>
              {paquetesRecientes.map((p, i) => (
                <tr key={i} className="hover:bg-gray-50">
                  <td className="px-4 py-2 font-semibold text-blue-600">{p.guia}</td>
                  <td className="px-4 py-2">{p.remitente}</td>
                  <td className="px-4 py-2">{p.destinatario}</td>
                  <td className="px-4 py-2">{p.fecha}</td>
                  <td className="px-4 py-2">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${estadoColor[p.estado]}`}>
                      {p.estado}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </Protegido>
  );
};

export default Dashboard;

// Subcomponente para tarjetas
const CardResumen = ({ titulo, valor, color }) => (
  <div className={`p-4 text-white rounded shadow ${color}`}>
    <h2 className="text-sm">{titulo}</h2>
    <p className="text-2xl font-bold">{valor}</p>
  </div>
);
