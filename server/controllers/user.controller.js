import connectDB from '../lib/db.js';
import bcrypt from 'bcrypt';

export const getAllUsers = async (req, res) => {
  try {
    const db = await connectDB();
    const [rows] = await db.query(
      `SELECT u.id, u.nombre, u.email, r.nombre AS rol
       FROM usuarios u
       JOIN roles r ON u.role_id = r.id`
    );
    res.json(rows);
  } catch (err) {
    console.error('Error al obtener usuarios:', err.message);
    res.status(500).json({ error: 'Error al obtener usuarios' });
  }
};

export const addUser = async (req, res) => {
  try {
    const db = await connectDB();
    const { nombre, email, password, rol } = req.body;

    let rolDB = rol.toLowerCase();
    if (rolDB === 'administrador') rolDB = 'admin';

    const [[roleRow]] = await db.query(
      'SELECT id FROM roles WHERE nombre = ?',
      [rolDB]
    );

    if (!roleRow) {
      return res.status(400).json({ error: 'Rol no encontrado' });
    }

    const role_id = roleRow.id;
    const hash = await bcrypt.hash(password, 10);

    await db.query(
      `INSERT INTO usuarios (nombre, email, password, role_id)
       VALUES (?, ?, ?, ?)`,
      [nombre, email, hash, role_id]
    );

    res.json({ message: 'Usuario creado exitosamente' });
  } catch (err) {
    console.error('Error al agregar usuario:', err.message);
    res.status(500).json({ error: 'Error al agregar usuario' });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const db = await connectDB();
    const { id } = req.params;

    await db.query('DELETE FROM usuarios WHERE id = ?', [id]);

    res.json({ message: 'Usuario eliminado exitosamente' });
  } catch (err) {
    console.error('Error al eliminar usuario:', err.message);
    res.status(500).json({ error: 'Error al eliminar usuario' });
  }
};

export const updateUser = async (req, res) => {
  try {
    const db = await connectDB();
    const { id } = req.params;
    const { nombre, email, rol } = req.body;

    let rolDB = rol.toLowerCase();
    if (rolDB === 'administrador') rolDB = 'admin';

    const [[roleRow]] = await db.query(
      'SELECT id FROM roles WHERE nombre = ?',
      [rolDB]
    );

    if (!roleRow) {
      return res.status(400).json({ error: 'Rol no encontrado' });
    }

    const role_id = roleRow.id;

    await db.query(
      `UPDATE usuarios
       SET nombre = ?, email = ?, role_id = ?
       WHERE id = ?`,
      [nombre, email, role_id, id]
    );

    res.json({ message: 'Usuario actualizado exitosamente' });
  } catch (err) {
    console.error('Error al actualizar usuario:', err.message);
    res.status(500).json({ error: 'Error al actualizar usuario' });
  }
};
