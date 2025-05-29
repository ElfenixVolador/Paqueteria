import connectDB from '../lib/db.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import config from '../config/index.js';

const SALT_ROUNDS = 10;

export async function registerUser({ username, email, password }) {
  const db = await connectDB();

  // Verificar si el usuario ya existe
  const [rows] = await db.query('SELECT 1 FROM usuarios WHERE email = ?', [email]);
  if (rows.length > 0) {
    const err = new Error('User already exists');
    err.code = 'USER_EXISTS';
    throw err;
  }

  // 🚀 Asignar rol 'usuario' por defecto (sin esperar que el frontend lo mande)
  const [[roleRow]] = await db.query('SELECT id FROM roles WHERE nombre = ?', ['usuario']);
  if (!roleRow) {
    const err = new Error('Default role not found');
    err.code = 'ROLE_NOT_FOUND';
    throw err;
  }

  const role_id = roleRow.id;
  const hash = await bcrypt.hash(password, SALT_ROUNDS);

  await db.query(
    `INSERT INTO usuarios (nombre, email, password, role_id)
     VALUES (?, ?, ?, ?)`,
    [username, email, hash, role_id]
  );

  return { message: 'User created successfully' };
}

export async function loginUser({ email, password }) {
  const db = await connectDB();

  const [rows] = await db.query(
    `SELECT u.id, u.password, r.nombre AS role
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

  const token = jwt.sign(
    { id: user.id, role: user.role },
    config.jwtKey,
    { expiresIn: '3h' }
  );

  return { token, role: user.role };
}

export async function getUserById(userId) {
  const db = await connectDB();

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
 