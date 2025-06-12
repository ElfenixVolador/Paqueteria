import db from '../lib/db.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import config from '../config/index.js';

const SALT_ROUNDS = 10;

// Registrar usuario
export async function registerUser({ username, email, password }) {
  const [rows] = await db.query('SELECT 1 FROM usuarios WHERE email = ?', [email]);
  if (rows.length > 0) {
    const err = new Error('User already exists');
    err.code = 'USER_EXISTS';
    throw err;
  }

  const [[roleRow]] = await db.query('SELECT id FROM roles WHERE nombre = ?', ['usuario']);
  if (!roleRow) {
    const err = new Error('Default role not found');
    err.code = 'ROLE_NOT_FOUND';
    throw err;
  }

  const hash = await bcrypt.hash(password, SALT_ROUNDS);

  await db.query(
    `INSERT INTO usuarios (nombre, email, password, role_id)
     VALUES (?, ?, ?, ?)`,
    [username, email, hash, roleRow.id]
  );

  return { message: 'User created successfully' };
}

// Login de usuario
export async function loginUser({ email, password }) {
  if (!email || !password) {
    const err = new Error('Email and password are required');
    err.code = 'MISSING_FIELDS';
    throw err;
  }

  const [rows] = await db.query(
    `SELECT u.id, u.nombre, u.email, u.password, r.id AS role_id, r.nombre AS role
     FROM usuarios u
     JOIN roles r ON u.role_id = r.id
     WHERE u.email = ?`,
    [email]
  );

  if (rows.length === 0) {
    const err = new Error('User not found');
    err.code = 'USER_NOT_FOUND';
    throw err;
  }

  const user = rows[0];
  const match = await bcrypt.compare(password, user.password);
  if (!match) {
    const err = new Error('Wrong password');
    err.code = 'WRONG_PASSWORD';
    throw err;
  }

  // 🔁 Obtener permisos desde la tabla roles_permisos
  const [permisos] = await db.query(
    `SELECT modulo, accion FROM roles_permisos WHERE role_id = ?`,
    [user.role_id]
  );

  const token = jwt.sign(
    { id: user.id, role: user.role },
    config.jwtKey,
    { expiresIn: '3h' }
  );

  return {
    token,
    usuario: {
      id: user.id,
      nombre: user.nombre,
      rol: user.role,
      permisos
    }
  };
}

// Obtener datos de usuario por ID
export async function getUserById(userId) {
  const [rows] = await db.query(
    `SELECT u.id, u.nombre, u.email, r.nombre AS role
     FROM usuarios u
     JOIN roles r ON u.role_id = r.id
     WHERE u.id = ?`,
    [userId]
  );

  if (rows.length === 0) {
    const err = new Error('User not found');
    err.code = 'USER_NOT_FOUND';
    throw err;
  }

  return rows[0];
}
