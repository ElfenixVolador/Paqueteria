import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ModalCrearRol = ({ visible, onClose, onRolCreado, rolEditar }) => {
  const [nombre, setNombre] = useState('');
  const [permisos, setPermisos] = useState([]);
  const [seleccionados, setSeleccionados] = useState([]);

  // Cargar permisos disponibles
  useEffect(() => {
    if (visible) {
      axios
        .get('http://localhost:3000/api/roles/permisos', { withCredentials: true })
        .then((res) => setPermisos(res.data))
        .catch(() => alert('No se pudieron cargar los permisos.'));
    }
  }, [visible]);

  // Si se está editando, carga nombre y permisos
  useEffect(() => {
    if (rolEditar) {
      setNombre(rolEditar.nombre);

      axios
        .get(`http://localhost:3000/api/roles/${rolEditar.id}/permisos`, { withCredentials: true })
        .then((res) => {
          const ids = res.data.map((permiso) => permiso.id);
          setSeleccionados(ids);
        })
        .catch((err) => console.error('Error cargando permisos del rol:', err));
    } else {
      setNombre('');
      setSeleccionados([]);
    }
  }, [rolEditar]);

  const handleCheck = (permisoId) => {
    setSeleccionados((prev) =>
      prev.includes(permisoId) ? prev.filter((id) => id !== permisoId) : [...prev, permisoId]
    );
  };

  const handleGuardar = async () => {
    try {
      if (rolEditar) {
        // MODO EDICIÓN
        await axios.put(
          `http://localhost:3000/api/roles/${rolEditar.id}`,
          { nombre, permisos: seleccionados },
          { withCredentials: true }
        );
      } else {
        // MODO CREACIÓN
        await axios.post(
          'http://localhost:3000/api/roles',
          { nombre, permisos: seleccionados },
          { withCredentials: true }
        );
      }

      onRolCreado();
      onClose();
    } catch (err) {
      alert(err.response?.data?.message || 'Error al guardar rol');
    }
  };

  if (!visible) return null;

  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded shadow-lg w-[400px]">
        <h2 className="text-xl font-bold mb-4">
          {rolEditar ? 'Editar rol' : 'Crear nuevo rol'}
        </h2>

        <label className="block mb-2 text-sm">Nombre del rol</label>
        <input
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          className="w-full border px-3 py-1 mb-4"
          placeholder="Ej. Visitante"
        />

        <p className="text-sm font-medium mb-2">Seleccionar permisos:</p>
        <div className="max-h-40 overflow-y-auto border rounded px-2 py-1 mb-4">
          {permisos.map((perm) => (
            <label key={perm.id} className="block text-sm">
              <input
                type="checkbox"
                className="mr-2"
                checked={seleccionados.includes(perm.id)}
                onChange={() => handleCheck(perm.id)}
              />
              {perm.modulo} → {perm.accion}
            </label>
          ))}
        </div>

        <div className="flex justify-end gap-2">
          <button onClick={onClose} className="text-gray-500 px-3 py-1 hover:underline">
            Cancelar
          </button>
          <button
            onClick={handleGuardar}
            className="bg-blue-600 text-white px-4 py-1 rounded"
          >
            Guardar
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModalCrearRol;
