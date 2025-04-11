// routes/authRoutes.js
import express from 'express';
import { connectToDatabase } from '../lib/db.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const router = express.Router();

/* ====================================================
   RUTAS DE AUTENTICACIÓN
   ==================================================== */

// Registro de usuario
router.post('/register', async (req, res) => {
  const { username, email, password } = req.body;
  try {
    const db = await connectToDatabase();
    const [rows] = await db.query('SELECT * FROM usuarios WHERE email = ?', [email]);
    if (rows.length > 0) {
      return res.status(409).json({ message: "User already existed" });
    }
    const hashPassword = await bcrypt.hash(password, 10);
    await db.query("INSERT INTO usuarios (nombre, email, password) VALUES (?, ?, ?)", 
      [username, email, hashPassword]
    );
    return res.status(201).json({ message: "User created successfully" });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});

// Login de usuario
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const db = await connectToDatabase();
    const [rows] = await db.query('SELECT * FROM usuarios WHERE email = ?', [email]);
    if (rows.length === 0) {
      return res.status(404).json({ message: "User not existed" });
    }
    const isMatch = await bcrypt.compare(password, rows[0].password);
    if (!isMatch) {
      return res.status(401).json({ message: "Wrong password" });
    }
    const token = jwt.sign({ id: rows[0].id_usuario }, process.env.JWT_KEY, { expiresIn: '3h' });
    return res.status(201).json({ token: token });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});

// Middleware para verificar token
const verifyToken = async (req, res, next) => {
  try {
    const token = req.headers['authorization']?.split(' ')[1];
    if (!token) {
      return res.status(403).json({ message: "No Token Provided" });
    }
    const decoded = jwt.verify(token, process.env.JWT_KEY);
    req.userId = decoded.id;
    next();
  } catch (err) {
    return res.status(500).json({ message: "Server error" });
  }
};

// Ruta protegida para obtener información del usuario
router.get('/home', verifyToken, async (req, res) => {
  try {
    const db = await connectToDatabase();
    const [rows] = await db.query('SELECT * FROM usuarios WHERE id_usuario = ?', [req.userId]);
    if (rows.length === 0) {
      return res.status(404).json({ message: "User not existed" });
    }
    return res.status(201).json({ user: rows[0] });
  } catch (err) {
    return res.status(500).json({ message: "Server error" });
  }
});

/* ====================================================
   RUTAS PARA MANEJAR PAQUETES
   ==================================================== */

// Registrar un nuevo paquete
router.post('/registropaq', async (req, res) => {
  const {
    remitente,
    destinatario,
    area_destino,
    descripcion,
    numero_guia,
    empresa_paqueteria,
    fecha_entrega,
    estado,
    recibido_por,
  } = req.body;

  if (!remitente || !destinatario || !area_destino || !numero_guia || !empresa_paqueteria || !estado) {
    return res.status(400).json({ message: "Todos los campos obligatorios deben ser completados" });
  }

  try {
    const db = await connectToDatabase();
    const query = `
      INSERT INTO paquetes 
      (remitente, destinatario, area_destino, descripcion, numero_guia, empresa_paqueteria, fecha_entrega, estado, recibido_por) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    const values = [
      remitente,
      destinatario,
      area_destino,
      descripcion || null,
      numero_guia,
      empresa_paqueteria,
      fecha_entrega || null,
      estado,
      recibido_por || null,
    ];

    await db.query(query, values);
    return res.status(201).json({ message: "Paquete registrado con éxito" });
  } catch (error) {
    console.error("Error al registrar el paquete:", error);
    return res.status(500).json({ message: "Error en el servidor" });
  }
});

// Obtener todos los paquetes
router.get('/registropaq', async (req, res) => {
  try {
    const db = await connectToDatabase();
    const [rows] = await db.query("SELECT * FROM paquetes");
    return res.status(200).json(rows);
  } catch (error) {
    console.error("Error al obtener paquetes:", error);
    return res.status(500).json({ message: "Error en el servidor" });
  }
});

// Obtener un paquete por ID
router.get('/registropaq/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const db = await connectToDatabase();
    const [rows] = await db.query("SELECT * FROM paquetes WHERE id_paquete = ?", [id]);
    if (rows.length === 0) {
      return res.status(404).json({ message: "Paquete no encontrado" });
    }
    return res.status(200).json(rows[0]);
  } catch (error) {
    console.error("Error al obtener el paquete:", error);
    return res.status(500).json({ message: "Error en el servidor" });
  }
});

// Actualizar un paquete
router.put('/registropaq/:id', async (req, res) => {
  const { id } = req.params;
  const {
    remitente,
    destinatario,
    area_destino,
    descripcion,
    numero_guia,
    empresa_paqueteria,
    fecha_entrega,
    estado,
    recibido_por,
  } = req.body;

  try {
    const db = await connectToDatabase();
    const query = `
      UPDATE paquetes 
      SET remitente = ?, destinatario = ?, area_destino = ?, descripcion = ?, numero_guia = ?, empresa_paqueteria = ?, fecha_entrega = ?, estado = ?, recibido_por = ? 
      WHERE id_paquete = ?
    `;
    const values = [
      remitente,
      destinatario,
      area_destino,
      descripcion || null,
      numero_guia,
      empresa_paqueteria,
      fecha_entrega || null,
      estado,
      recibido_por || null,
      id,
    ];

    const [result] = await db.query(query, values);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Paquete no encontrado" });
    }
    return res.status(200).json({ message: "Paquete actualizado con éxito" });
  } catch (error) {
    console.error("Error al actualizar el paquete:", error);
    return res.status(500).json({ message: "Error en el servidor" });
  }
});

// Eliminar un paquete
router.delete('/registropaq/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const db = await connectToDatabase();
    const [result] = await db.query("DELETE FROM paquetes WHERE id_paquete = ?", [id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Paquete no encontrado" });
    }
    return res.status(200).json({ message: "Paquete eliminado con éxito" });
  } catch (error) {
    console.error("Error al eliminar el paquete:", error);
    return res.status(500).json({ message: "Error en el servidor" });
  }
});

export default router;
