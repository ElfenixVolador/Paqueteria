import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ModalCrearRol from '../componentes/ModalCrearRol';

const Roles = () => {
  const [roles, setRoles] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [editando, setEditando] = useState(null); // para edición

  const cargarRoles = async () => {
    try {
      const res = await axios.get('http://localhost:3000/api/roles', { withCredentials: true });
      setRoles(res.data);
    } catch (err) {
      console.error('Error al cargar roles:', err);
    }
  };

  const eliminarRol = async (id) => {
    if (!window.confirm('¿Estás seguro de eliminar este rol?')) return;
    try {
      await axios.delete(`http://localhost:3000/api/roles/${id}`, { withCredentials: true });
      cargarRoles();
    } catch (err) {
      alert(err.response?.data?.message || 'Error al eliminar rol');
    }
  };

  useEffect(() => {
    cargarRoles();
  }, []);

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Gestión de Roles</h2>
        <button
          onClick={() => { setEditando(null); setModalVisible(true); }}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Crear nuevo rol
        </button>
      </div>

      <table className="w-full border text-sm">
        <thead className="bg-gray-100">
          <tr>
            <th className="border px-2 py-1">ID</th>
            <th className="border px-2 py-1">Nombre del Rol</th>
            <th className="border px-2 py-1">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {roles.map((rol) => (
            <tr key={rol.id}>
              <td className="border px-2 py-1">{rol.id}</td>
              <td className="border px-2 py-1">{rol.nombre}</td>
              <td className="border px-2 py-1">
                {['admin', 'usuario'].includes(rol.nombre.toLowerCase()) ? (
                  <span className="italic text-gray-500">Protegido</span>
                ) : (
                  <>
                    <button
                      className="text-blue-600 mr-2"
                      onClick={() => { setEditando(rol); setModalVisible(true); }}
                    >
                      Editar
                    </button>
                    <button
                      className="text-red-600"
                      onClick={() => eliminarRol(rol.id)}
                    >
                      Eliminar
                    </button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <ModalCrearRol
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onRolCreado={cargarRoles}
        rolEditar={editando} // se usará para modo edición
      />
    </div>
  );
};

export default Roles;
