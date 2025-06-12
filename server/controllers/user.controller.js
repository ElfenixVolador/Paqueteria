// server/controllers/user.controller.js
import db from '../lib/db.js';
import bcrypt from 'bcrypt';

// Obtener todos los usuarios con su nombre de rol
export const getAllUsers = async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT u.id, u.nombre, u.email, u.role_id, r.nombre AS rol
      FROM usuarios u
      JOIN roles r ON u.role_id = r.id
    `);
    res.json(rows);
  } catch (err) {
    console.error('Error al obtener usuarios:', err.message);
    res.status(500).json({ error: 'Error al obtener usuarios' });
  }
};

// Agregar un usuario (usando role_id directamente)
export const addUser = async (req, res) => {
  try {
    const { nombre, email, password, role_id } = req.body;

    if (!role_id) {
      return res.status(400).json({ error: 'role_id es requerido' });
    }

    const hash = await bcrypt.hash(password, 10);

    await db.query(
      'INSERT INTO usuarios (nombre, email, password, role_id) VALUES (?, ?, ?, ?)',
      [nombre, email, hash, role_id]
    );

    res.json({ message: 'Usuario creado exitosamente' });
  } catch (err) {
    console.error('Error al agregar usuario:', err.message);
    res.status(500).json({ error: 'Error al agregar usuario' });
  }
};

// Eliminar un usuario
export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    await db.query('DELETE FROM usuarios WHERE id = ?', [id]);
    res.json({ message: 'Usuario eliminado exitosamente' });
  } catch (err) {
    console.error('Error al eliminar usuario:', err.message);
    res.status(500).json({ error: 'Error al eliminar usuario' });
  }
};

// Actualizar un usuario (usando role_id)
export const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, email, role_id } = req.body;

    if (!role_id) {
      return res.status(400).json({ error: 'role_id es requerido' });
    }

    await db.query(
      'UPDATE usuarios SET nombre = ?, email = ?, role_id = ? WHERE id = ?',
      [nombre, email, role_id, id]
    );

    res.json({ message: 'Usuario actualizado exitosamente' });
  } catch (err) {
    console.error('Error al actualizar usuario:', err.message);
    res.status(500).json({ error: 'Error al actualizar usuario' });
  }
};
