// rol.controller.js
import pool from '../lib/db.js';

// Obtener todos los roles
export const obtenerRoles = async (req, res) => {
  try {
    const [roles] = await pool.query('SELECT * FROM roles');
    res.json(roles);
  } catch (err) {
    console.error('Error al obtener roles:', err);
    res.status(500).json({ message: 'Error al obtener roles' });
  }
};

// Obtener todos los permisos disponibles
export const obtenerPermisos = async (req, res) => {
  try {
    const [permisos] = await pool.query('SELECT * FROM permisos');
    res.json(permisos);
  } catch (error) {
    console.error('Error al obtener permisos:', error);
    res.status(500).json({ message: 'Error al obtener permisos' });
  }
};

// Crear nuevo rol con permisos
export const crearRolConPermisos = async (req, res) => {
  const { nombre, permisos } = req.body;
  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();

    const [result] = await conn.query('INSERT INTO roles (nombre) VALUES (?)', [nombre]);
    const rolId = result.insertId;

    for (const permisoId of permisos) {
      await conn.query(
        'INSERT INTO rol_permisos (rol_id, permiso_id) VALUES (?, ?)',
        [rolId, permisoId]
      );
    }

    await conn.commit();
    res.status(201).json({ message: 'Rol creado correctamente' });
  } catch (err) {
    await conn.rollback();
    console.error('Error al crear rol:', err);
    res.status(500).json({ message: 'Error al crear rol' });
  } finally {
    conn.release();
  }
};

// Eliminar rol (excepto protegidos)
export const eliminarRol = async (req, res) => {
  const { id } = req.params;

  try {
    const [[rol]] = await pool.query('SELECT nombre FROM roles WHERE id = ?', [id]);

    if (!rol) {
      return res.status(404).json({ message: 'Rol no encontrado' });
    }

    if (['admin', 'usuario'].includes(rol.nombre.toLowerCase())) {
      return res.status(403).json({ message: 'Este rol no puede eliminarse' });
    }

    await pool.query('DELETE FROM rol_permisos WHERE rol_id = ?', [id]);
    await pool.query('DELETE FROM roles WHERE id = ?', [id]);

    res.json({ message: 'Rol eliminado correctamente' });
  } catch (err) {
    console.error('Error al eliminar rol:', err);
    res.status(500).json({ message: 'Error al eliminar rol' });
  }
};

// Obtener permisos de un rol especifico
export const getPermisosPorRol = async (req, res) => {
  const { id } = req.params;

  try {
    const [permisos] = await pool.query(
      `SELECT p.id, p.modulo, p.accion
       FROM rol_permisos rp
       JOIN permisos p ON rp.permiso_id = p.id
       WHERE rp.rol_id = ?`,
      [id]
    );

    res.json(permisos);
  } catch (err) {
    console.error('Error al obtener permisos del rol:', err);
    res.status(500).json({ error: 'Error al obtener permisos' });
  }
};