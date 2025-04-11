import React, { useState, useEffect } from 'react';
import axios from 'axios';

const RegistroPaq = () => {
  // Estado para el formulario de registro
  const [form, setForm] = useState({
    remitente: '',
    destinatario: '',
    area_destino: '',
    descripcion: '',
    numero_guia: '',
    empresa_paqueteria: ''
  });

  // Estado para la lista de paquetes
  const [paquetes, setPaquetes] = useState([]);
  // Estado para saber si estamos en modo edición
  const [editMode, setEditMode] = useState(false);
  const [editId, setEditId] = useState(null);

  // Función para actualizar el formulario según cambios en los inputs
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Función para traer los datos de la tabla
  const fetchPaquetes = async () => {
    try {
      const response = await axios.get('http://localhost:3000/auth/registropaq');
      setPaquetes(response.data);
    } catch (error) {
      console.error('Error al obtener los paquetes:', error);
    }
  };

  useEffect(() => {
    fetchPaquetes();
  }, []);

  // Función para manejar el envío del formulario (crear o editar)
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (!editMode) {
        // Para crear paquete, agregamos un valor por defecto para "estado"
        const newPackage = { ...form, estado: 'pendiente' };
        await axios.post('http://localhost:3000/auth/registropaq', newPackage);
        alert('Paquete registrado con éxito');
      } else {
        // Actualizar paquete
        await axios.put(`http://localhost:3000/auth/registropaq/${editId}`, { ...form, estado: 'pendiente' });
        alert('Paquete actualizado con éxito');
        setEditMode(false);
        setEditId(null);
      }
      // Limpiar formulario
      setForm({
        remitente: '',
        destinatario: '',
        area_destino: '',
        descripcion: '',
        numero_guia: '',
        empresa_paqueteria: ''
      });
      // Refrescar lista de paquetes
      fetchPaquetes();
    } catch (error) {
      console.error('Error en el registro/actualización:', error);
    }
  };

  // Función para eliminar un paquete
  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:3000/auth/registropaq/${id}`);
      alert('Paquete eliminado');
      fetchPaquetes();
    } catch (error) {
      console.error('Error al eliminar el paquete:', error);
    }
  };

  // Función para poner en modo edición y rellenar el formulario
  const handleEdit = (paquete) => {
    setEditMode(true);
    setEditId(paquete.id_paquete);
    setForm({
      remitente: paquete.remitente,
      destinatario: paquete.destinatario,
      area_destino: paquete.area_destino,
      descripcion: paquete.descripcion,
      numero_guia: paquete.numero_guia,
      empresa_paqueteria: paquete.empresa_paqueteria
    });
  };

  return (
    <div className="p-5">
      <h2 className="text-2xl font-bold mb-4">{editMode ? 'Editar Paquete' : 'Registrar Paquete'}</h2>
      <form onSubmit={handleSubmit} className="mb-8">
        <input
          type="text"
          name="remitente"
          placeholder="Remitente"
          value={form.remitente}
          onChange={handleChange}
          className="border p-2 w-full mb-2"
          required
        />
        <input
          type="text"
          name="destinatario"
          placeholder="Destinatario"
          value={form.destinatario}
          onChange={handleChange}
          className="border p-2 w-full mb-2"
          required
        />
        <input
          type="text"
          name="area_destino"
          placeholder="Área Destino"
          value={form.area_destino}
          onChange={handleChange}
          className="border p-2 w-full mb-2"
          required
        />
        <textarea
          name="descripcion"
          placeholder="Descripción"
          value={form.descripcion}
          onChange={handleChange}
          className="border p-2 w-full mb-2"
        />
        <input
          type="text"
          name="numero_guia"
          placeholder="Número de Guía"
          value={form.numero_guia}
          onChange={handleChange}
          className="border p-2 w-full mb-2"
          required
        />
        <input
          type="text"
          name="empresa_paqueteria"
          placeholder="Empresa de Paquetería"
          value={form.empresa_paqueteria}
          onChange={handleChange}
          className="border p-2 w-full mb-2"
          required
        />
        <button type="submit" className="bg-blue-500 text-white p-2 w-full">
          {editMode ? 'Actualizar' : 'Registrar'}
        </button>
      </form>

      <h2 className="text-2xl font-bold mb-4">Lista de Paquetes</h2>
      <table className="w-full border-collapse border border-gray-400">
        <thead>
          <tr>
            <th className="border border-gray-400 p-2">ID</th>
            <th className="border border-gray-400 p-2">Remitente</th>
            <th className="border border-gray-400 p-2">Destinatario</th>
            <th className="border border-gray-400 p-2">Área Destino</th>
            <th className="border border-gray-400 p-2">Número de Guía</th>
            <th className="border border-gray-400 p-2">Empresa</th>
            <th className="border border-gray-400 p-2">Estado</th>
            <th className="border border-gray-400 p-2">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {paquetes.map((paquete) => (
            <tr key={paquete.id_paquete}>
              <td className="border border-gray-400 p-2">{paquete.id_paquete}</td>
              <td className="border border-gray-400 p-2">{paquete.remitente}</td>
              <td className="border border-gray-400 p-2">{paquete.destinatario}</td>
              <td className="border border-gray-400 p-2">{paquete.area_destino}</td>
              <td className="border border-gray-400 p-2">{paquete.numero_guia}</td>
              <td className="border border-gray-400 p-2">{paquete.empresa_paqueteria}</td>
              <td className="border border-gray-400 p-2">{paquete.estado}</td>
              <td className="border border-gray-400 p-2 flex gap-2">
                <button
                  onClick={() => handleEdit(paquete)}
                  className="bg-green-500 text-white px-2 py-1 rounded"
                >
                  Editar
                </button>
                <button
                  onClick={() => handleDelete(paquete.id_paquete)}
                  className="bg-red-500 text-white px-2 py-1 rounded"
                >
                  Eliminar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default RegistroPaq;
