import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Protegido from '../componentes/Protegido';

const Seguimiento = () => {
  const [paquetes, setPaquetes] = useState([]);
  const [filtro, setFiltro] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [paqueteActual, setPaqueteActual] = useState(null);
  const [estadoSeleccionado, setEstadoSeleccionado] = useState('recibido');
  const usuarioId = JSON.parse(localStorage.getItem('usuario'))?.id;

  const fetchPaquetes = async () => {
    try {
      const { data } = await axios.get('http://localhost:3000/api/paquetes/registropaq', {
        withCredentials: true,
      });
      setPaquetes(data);
    } catch (err) {
      console.error('Error al cargar datos:', err);
    }
  };

  useEffect(() => {
    fetchPaquetes();
  }, []);

  const abrirModal = (paquete) => {
    setPaqueteActual(paquete);
    setEstadoSeleccionado('recibido');
    setModalOpen(true);
  };

  const cerrarModal = () => {
    setModalOpen(false);
    setPaqueteActual(null);
  };

  const confirmarCambioEstado = async () => {
    try {
      await axios.post('http://localhost:3000/api/seguimiento', {
        id_paquete: paqueteActual.id_paquete,
        accion: estadoSeleccionado,
        observaciones: `Estado cambiado manualmente a ${estadoSeleccionado}`,
        usuario_id: usuarioId
      }, {
        withCredentials: true
      });

      cerrarModal();
      fetchPaquetes();
    } catch (err) {
      console.error('Error al cambiar estado:', err);
    }
  };

  const paquetesFiltrados = paquetes.filter(p =>
    p.numero_guia?.toLowerCase().includes(filtro.toLowerCase())
  );

  return (
    <Protegido modulo="paquetes" accion="ver">
      <div className="p-6">
        <h2 className="text-2xl font-bold mb-4">Seguimiento de Paquetes</h2>

        <div className="flex gap-2 mb-4">
          <input
            type="text"
            placeholder="Buscar por # guía"
            value={filtro}
            onChange={e => setFiltro(e.target.value)}
            className="border rounded px-3 py-1 w-64"
          />
          <button
            className="bg-blue-600 text-white px-4 py-1 rounded"
            onClick={fetchPaquetes}
          >
            Aplicar Filtros
          </button>
        </div>

        <table className="w-full border text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2 border"># GUÍA</th>
              <th className="p-2 border">REMITENTE</th>
              <th className="p-2 border">DESTINATARIO</th>
              <th className="p-2 border">EMPRESA</th>
              <th className="p-2 border">FECHA</th>
              <th className="p-2 border">ESTADO</th>
              <th className="p-2 border">ACCIÓN</th>
            </tr>
          </thead>
          <tbody>
            {paquetesFiltrados.length === 0 ? (
              <tr>
                <td colSpan="7" className="text-center p-4 text-gray-500">No hay resultados</td>
              </tr>
            ) : (
              paquetesFiltrados.map((p, i) => (
                <tr key={i} className="border-t text-center">
                  <td className="p-2 border text-blue-600 font-semibold">{p.numero_guia}</td>
                  <td className="p-2 border">{p.remitente}</td>
                  <td className="p-2 border">{p.destinatario}</td>
                  <td className="p-2 border">{p.empresa_paqueteria}</td>
                  <td className="p-2 border">{new Date(p.fecha_recepcion).toLocaleDateString()}</td>
                  <td className="p-2 border">
                    {(() => {
                      const estado = p.estado?.toLowerCase();
                      const color = estado === 'pendiente'
                        ? 'bg-gray-200 text-gray-700'
                        : estado === 'recibido'
                        ? 'bg-emerald-600 text-white'
                        : estado === 'entregado'
                        ? 'bg-emerald-700 text-white'
                        : 'bg-gray-100 text-black';
                      const label = ['pendiente', 'recibido', 'entregado'].includes(estado)
                        ? estado.charAt(0).toUpperCase() + estado.slice(1)
                        : '—';

                      return (
                        <span className={`px-2 py-1 rounded text-xs font-medium ${color}`}>
                          {label}
                        </span>
                      );
                    })()}
                  </td>
                  <td className="p-2 border">
                    <button
                      className="bg-indigo-500 hover:bg-indigo-600 text-white px-3 py-1 text-xs rounded"
                      onClick={() => abrirModal(p)}
                    >
                      Cambiar Estado
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        {modalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded shadow-md w-80 space-y-4">
              <h3 className="text-lg font-bold">Cambiar Estado</h3>
              <p>Guía: <strong>{paqueteActual?.numero_guia}</strong></p>
              <select
                className="w-full border rounded px-2 py-1"
                value={estadoSeleccionado}
                onChange={e => setEstadoSeleccionado(e.target.value)}
              >
                <option value="recibido">Recibido</option>
                <option value="entregado">Entregado</option>
              </select>
              <div className="flex justify-end gap-2">
                <button
                  className="px-4 py-1 text-sm rounded bg-gray-200 hover:bg-gray-300"
                  onClick={cerrarModal}
                >
                  Cancelar
                </button>
                <button
                  className="px-4 py-1 text-sm rounded bg-blue-600 text-white hover:bg-blue-700"
                  onClick={confirmarCambioEstado}
                >
                  Confirmar
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </Protegido>
  );
};

export default Seguimiento;
