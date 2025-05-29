import connectDB from '../lib/db.js';

export const getAllSeguimientos = async (req, res) => {
  try {
    const db = await connectDB();
    const [rows] = await db.query(
      `SELECT s.*, p.numero_guia, p.remitente, p.destinatario, p.empresa_paqueteria
       FROM seguimiento s
       JOIN paquetes p ON s.id_paquete = p.id_paquete
       ORDER BY s.create_time DESC`
    );
    res.json(rows);
  } catch (err) {
    console.error('Error al obtener seguimientos:', err.message);
    res.status(500).json({ error: 'Error al obtener seguimientos' });
  }
};

export const getSeguimientosByPaquete = async (req, res) => {
  try {
    const db = await connectDB();
    const { id_paquete } = req.params;
    const [rows] = await db.query(
      `SELECT * FROM seguimiento WHERE id_paquete = ? ORDER BY create_time DESC`,
      [id_paquete]
    );
    res.json(rows);
  } catch (err) {
    console.error('Error al obtener seguimiento por paquete:', err.message);
    res.status(500).json({ error: 'Error al obtener seguimiento' });
  }
};

export const addSeguimiento = async (req, res) => {
  try {
    const db = await connectDB();
    const { id_paquete, estado, observaciones } = req.body;

    await db.query(
      `INSERT INTO seguimiento (id_paquete, estado, observaciones)
       VALUES (?, ?, ?)`,
      [id_paquete, estado, observaciones]
    );

    res.json({ message: 'Seguimiento agregado exitosamente' });
  } catch (err) {
    console.error('Error al agregar seguimiento:', err.message);
    res.status(500).json({ error: 'Error al agregar seguimiento' });
  }
};

export const getResumenEstados = async (req, res) => {
  try {
    const db = await connectDB();
    const [rows] = await db.query(
      `SELECT estado, COUNT(*) AS total
       FROM paquetes
       GROUP BY estado`
    );
    res.json(rows);
  } catch (err) {
    console.error('Error al obtener resumen de estados:', err.message);
    res.status(500).json({ error: 'Error al obtener resumen de estados' });
  }
};
