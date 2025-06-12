import React, { useState, useEffect } from 'react';
import api from '../axiosConfig';
import Protegido from '../componentes/Protegido';

const RegistroPaq = () => {
  const [form, setForm] = useState({
    empresa: '',
    remitente: '',
    telefono: '',
    destinatario: '',
    area_destino: '',
    notas: '',
    descripcion: '',
    numero_guia: '',
    empresa_paqueteria: '',
    fecha_recepcion: new Date().toISOString().slice(0, 16),
    firma: null
  });

  const [paquetes, setPaquetes] = useState([]);
  const [editMode, setEditMode] = useState(false);
  const [editId, setEditId] = useState(null);

  const usuario = JSON.parse(localStorage.getItem('usuario'));
  const usuarioId = usuario?.id || null;

  const fetchPaquetes = async () => {
    try {
      const res = await api.get(`/api/paquetes/registropaq?usuario_id=${usuarioId}`);
      setPaquetes(res.data);
    } catch (err) {
      console.error('Error al obtener paquetes:', err);
    }
  };

  useEffect(() => {
    fetchPaquetes();
  }, []);

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      const payload = { ...form, estado: 'pendiente', usuario_id: usuarioId };

      if (!editMode) {
        await api.post('/api/paquetes/registropaq', payload);
        alert('Paquete registrado con éxito');
      } else {
        await api.put(`/api/paquetes/registropaq/${editId}`, payload);
        alert('Paquete actualizado con éxito');
        setEditMode(false);
        setEditId(null);
      }

      setForm({
        empresa: '',
        remitente: '',
        telefono: '',
        destinatario: '',
        area_destino: '',
        notas: '',
        descripcion: '',
        numero_guia: '',
        empresa_paqueteria: '',
        fecha_recepcion: new Date().toISOString().slice(0, 16),
        firma: null
      });

      fetchPaquetes();
    } catch (err) {
      console.error('Error en el registro/actualización:', err);
    }
  };

  const handleEdit = p => {
    setEditMode(true);
    setEditId(p.id_paquete);
    setForm({
      empresa: p.empresa || '',
      remitente: p.remitente,
      telefono: p.telefono || '',
      destinatario: p.destinatario,
      area_destino: p.area_destino,
      notas: p.notas || '',
      descripcion: p.descripcion,
      numero_guia: p.numero_guia,
      empresa_paqueteria: p.empresa_paqueteria,
      fecha_recepcion: p.fecha_recepcion?.slice(0, 16) || new Date().toISOString().slice(0, 16),
      firma: p.firma || null
    });
  };

  const handleDelete = async id => {
    if (!window.confirm('¿Estás seguro de eliminar este paquete?')) return;

    try {
      await api.delete(`/api/paquetes/registropaq/${id}`);
      alert('Paquete eliminado');
      fetchPaquetes();
    } catch (err) {
      console.error('Error al eliminar el paquete:', err);
    }
  };

  return (
    <Protegido modulo="paquetes" accion="crear">
      <div className="max-w-6xl mx-auto p-6 space-y-10">
        {/* Formulario de registro */}
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow space-y-6">
          <h2 className="text-2xl font-bold text-blue-800 border-b pb-2">
            {editMode ? 'Editar Paquete' : 'Registro de Nuevo Paquete'}
          </h2>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Información del remitente */}
            <div>
              <h3 className="font-semibold mb-2">Información del Remitente</h3>
              <input name="empresa" placeholder="Empresa" value={form.empresa} onChange={handleChange} className="w-full border px-3 py-2 rounded mb-2" />
              <input name="remitente" placeholder="Persona de Contacto" value={form.remitente} onChange={handleChange} className="w-full border px-3 py-2 rounded mb-2" />
              <input name="telefono" placeholder="Teléfono" value={form.telefono} onChange={handleChange} className="w-full border px-3 py-2 rounded mb-2" />
            </div>
            {/* Información del destinatario */}
            <div>
              <h3 className="font-semibold mb-2">Información del Destinatario</h3>
              <select name="area_destino" value={form.area_destino} onChange={handleChange} className="w-full border px-3 py-2 rounded mb-2">
                <option value="">Seleccionar departamento</option>
                <option>Contabilidad</option>
                <option>IT</option>
                <option>RRHH</option>
                <option>Operaciones</option>
              </select>
              <input name="destinatario" placeholder="Persona" value={form.destinatario} onChange={handleChange} className="w-full border px-3 py-2 rounded mb-2" />
              <input name="notas" placeholder="Notas adicionales" value={form.notas} onChange={handleChange} className="w-full border px-3 py-2 rounded mb-2" />
            </div>
          </div>

          {/* Información del paquete y recepción */}
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold mb-2">Información del Paquete</h3>
              <textarea name="descripcion" placeholder="Descripción del contenido" value={form.descripcion} onChange={handleChange} className="w-full border px-3 py-2 rounded mb-2" />
              <input name="numero_guia" placeholder="Número de Guía" value={form.numero_guia} onChange={handleChange} className="w-full border px-3 py-2 rounded mb-2" />
              <select name="empresa_paqueteria" value={form.empresa_paqueteria} onChange={handleChange} className="w-full border px-3 py-2 rounded mb-2">
                <option value="">Seleccionar empresa</option>
                <option>DHL</option>
                <option>FedEx</option>
                <option>Estafeta</option>
                <option>UPS</option>
              </select>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Información de Recepción</h3>
              <label className="text-sm text-gray-600 block mb-1">Fecha y Hora</label>
              <input type="datetime-local" name="fecha_recepcion" value={form.fecha_recepcion} readOnly className="w-full border px-3 py-2 rounded mb-4 text-gray-500" />
              <div className="border px-3 py-4 rounded text-center text-gray-400">
                Firma pendiente
                <div className="text-right mt-2">
                  <button type="button" className="text-blue-600 text-sm">Firmar</button>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-4">
            <button type="button" className="px-4 py-2 border rounded" onClick={() => {
              setForm({
                empresa: '', remitente: '', telefono: '', destinatario: '', area_destino: '', notas: '',
                descripcion: '', numero_guia: '', empresa_paqueteria: '', fecha_recepcion: new Date().toISOString().slice(0, 16), firma: null
              });
              setEditMode(false);
              setEditId(null);
            }}>Cancelar</button>
            <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
              {editMode ? 'Actualizar Paquete' : 'Guardar Paquete'}
            </button>
          </div>

          <div className="mt-6 text-sm text-blue-800 bg-blue-100 border border-blue-300 px-4 py-3 rounded">
            Los paquetes registrados aparecerán automáticamente en el seguimiento.
          </div>
        </form>

        {/* Tabla de paquetes registrados */}
        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-2xl font-semibold text-blue-800 mb-4">Paquetes Registrados</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full border border-gray-300 text-sm rounded-md">
              <thead className="bg-blue-100 text-blue-900">
                <tr>
                  {['Empresa', 'Remitente', 'Teléfono', 'Destinatario', 'Área', 'Notas', 'Descripción', 'Guía', 'Empresa de Envío', 'Acciones'].map((th, i) => (
                    <th key={i} className="px-4 py-2 border-b">{th}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {paquetes.map(p => (
                  <tr key={p.id_paquete} className="hover:bg-gray-50">
                    <td className="border px-3 py-2">{p.empresa || '-'}</td>
                    <td className="border px-3 py-2">{p.remitente || '-'}</td>
                    <td className="border px-3 py-2">{p.telefono || '-'}</td>
                    <td className="border px-3 py-2">{p.destinatario || '-'}</td>
                    <td className="border px-3 py-2">{p.area_destino || '-'}</td>
                    <td className="border px-3 py-2">{p.notas || '-'}</td>
                    <td className="border px-3 py-2">{p.descripcion || '-'}</td>
                    <td className="border px-3 py-2">{p.numero_guia || '-'}</td>
                    <td className="border px-3 py-2">{p.empresa_paqueteria || '-'}</td>
                    <td className="border px-3 py-2">
                      <div className="flex flex-col items-center gap-2">
                        <button onClick={() => handleEdit(p)} className="bg-yellow-100 text-yellow-800 hover:bg-yellow-200 font-semibold px-3 py-1 rounded-md shadow">Editar</button>
                        <button onClick={() => handleDelete(p.id_paquete)} className="bg-red-100 text-red-700 hover:bg-red-200 font-semibold px-3 py-1 rounded-md shadow">Eliminar</button>
                      </div>
                    </td>
                  </tr>
                ))}
                {paquetes.length === 0 && (
                  <tr>
                    <td colSpan="10" className="text-center p-4 text-gray-500">No hay paquetes registrados.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </Protegido>
  );
};

export default RegistroPaq;
