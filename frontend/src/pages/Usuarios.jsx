import React, { useState, useEffect } from 'react';
import { FaEdit, FaTrashAlt } from 'react-icons/fa';
import { getAllUsers, addUser, deleteUser, updateUser } from '../services/userService';

const Usuarios = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [form, setForm] = useState({ nombre: '', email: '', rol: 'Usuario', password: '' });
  const [editMode, setEditMode] = useState(false);
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    fetchUsuarios();
  }, []);

  const fetchUsuarios = async () => {
    try {
      const res = await getAllUsers();
      setUsuarios(res.data);
    } catch (err) {
      console.error('Error al obtener usuarios:', err);
    }
  };

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();

    if (!form.password && !editMode) {
      alert('La contraseña es obligatoria para un nuevo usuario.');
      return;
    }

    try {
      if (editMode) {
        await updateUser(editId, {
          nombre: form.nombre,
          email: form.email,
          rol: form.rol // este enviará "Administrador" o "Usuario"
        });
      } else {
        await addUser(form);
      }

      fetchUsuarios();
      setForm({ nombre: '', email: '', rol: 'Usuario', password: '' });
      setEditMode(false);
      setEditId(null);
    } catch (err) {
      console.error('Error al agregar/actualizar usuario:', err);
    }
  };

  const handleEdit = usuario => {
    setEditMode(true);
    setEditId(usuario.id);
    setForm({ nombre: usuario.nombre, email: usuario.email, rol: usuario.rol, password: '' });
  };

  const handleDelete = async id => {
    if (confirm('¿Estás seguro de eliminar este usuario?')) {
      try {
        await deleteUser(id);
        fetchUsuarios();
      } catch (err) {
        console.error('Error al eliminar usuario:', err);
      }
    }
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold text-blue-900 mb-6">Gestión de Usuarios</h1>

      <form onSubmit={handleSubmit} className="grid grid-cols-4 gap-4 bg-white p-4 rounded shadow mb-8">
        <input
          type="text"
          name="nombre"
          placeholder="Nombre"
          value={form.nombre}
          onChange={handleChange}
          required
          className="col-span-1 border px-3 py-2 rounded"
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          required
          className="col-span-1 border px-3 py-2 rounded"
        />
        <select
          name="rol"
          value={form.rol}
          onChange={handleChange}
          className="col-span-1 border px-3 py-2 rounded"
        >
          <option value="Administrador">Administrador</option>
          <option value="Usuario">Usuario</option>
        </select>
        {!editMode && (
          <input
            type="password"
            name="password"
            placeholder="Contraseña"
            value={form.password}
            onChange={handleChange}
            className="col-span-1 border px-3 py-2 rounded"
          />
        )}
        <button
          type="submit"
          className="col-span-4 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded"
        >
          {editMode ? 'Actualizar Usuario' : 'Agregar Usuario'}
        </button>
      </form>

      <table className="w-full border text-sm bg-white shadow rounded">
        <thead className="bg-gray-100">
          <tr>
            <th className="border px-4 py-2">Nombre</th>
            <th className="border px-4 py-2">Email</th>
            <th className="border px-4 py-2">Rol</th>
            <th className="border px-4 py-2">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {usuarios.map(u => (
            <tr key={u.id} className="hover:bg-gray-50">
              <td className="border px-4 py-2">{u.nombre}</td>
              <td className="border px-4 py-2">{u.email}</td>
              <td className="border px-4 py-2">{u.rol}</td>
              <td className="border px-4 py-2 space-x-2">
                <button onClick={() => handleEdit(u)} className="text-yellow-600 hover:text-yellow-800">
                  <FaEdit />
                </button>
                <button onClick={() => handleDelete(u.id)} className="text-red-600 hover:text-red-800">
                  <FaTrashAlt />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Usuarios;
