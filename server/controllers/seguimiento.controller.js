import pool from '../lib/db.js';

// Obtener todos los seguimientos
export const getAllSeguimientos = async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT s.id, s.accion, s.create_time, s.observaciones,
             p.numero_guia, p.remitente, p.destinatario, p.empresa_paqueteria
      FROM seguimiento s
      JOIN paquetes p ON s.id_paquete = p.id_paquete
      ORDER BY s.create_time DESC
    `);
    res.json(rows);
  } catch (err) {
    console.error('Error al obtener seguimientos:', err);
    res.status(500).json({ error: 'Error al obtener seguimientos' });
  }
};

export const getSeguimientosByPaquete = async (req, res) => {
  try {
    const { id_paquete } = req.params;
    const [rows] = await pool.query(
      `SELECT * FROM seguimiento WHERE id_paquete = ? ORDER BY create_time DESC`,
      [id_paquete]
    );
    res.json(rows);
  } catch (err) {
    console.error('Error al obtener seguimiento por paquete:', err);
    res.status(500).json({ error: 'Error al obtener seguimiento' });
  }
};

export const addSeguimiento = async (req, res) => {
  try {
    const { id_paquete, accion, observaciones, usuario_id } = req.body;

    // Insertar en seguimiento
    await pool.query(
      `INSERT INTO seguimiento (id_paquete, accion, observaciones, usuario_id)
       VALUES (?, ?, ?, ?)`,
      [id_paquete, accion, observaciones, usuario_id]
    );

    // Actualizar estado en tabla paquetes
    if (accion === 'recibido') {
      await pool.query(`
        UPDATE paquetes
        SET estado = 'recibido', fecha_recepcion = NOW(), recibido_por = ?
        WHERE id_paquete = ?
      `, [usuario_id, id_paquete]);
    }

    if (accion === 'entregado') {
      await pool.query(`
        UPDATE paquetes
        SET estado = 'entregado', entregado = 1, fecha_entrega = NOW()
        WHERE id_paquete = ?
      `, [id_paquete]);
    }

    res.json({ message: 'Seguimiento registrado y estado actualizado' });
  } catch (err) {
    console.error('Error al agregar seguimiento:', err);
    res.status(500).json({ error: 'Error al agregar seguimiento' });
  }
};

export const getResumenGrafica = async (req, res) => {
  try {
    const [recibidos] = await pool.query(`
      SELECT DATE(create_time) AS fecha, COUNT(*) AS cantidad
      FROM seguimiento
      WHERE accion = 'recibido'
      GROUP BY DATE(create_time)
    `);
    const [entregados] = await pool.query(`
      SELECT DATE(create_time) AS fecha, COUNT(*) AS cantidad
      FROM seguimiento
      WHERE accion = 'entregado'
      GROUP BY DATE(create_time)
    `);
    res.json({ recibidos, entregados });
  } catch (error) {
    console.error('Error al obtener resumen de gráfica:', error);
    res.status(500).json({ error: 'Error al obtener resumen' });
  }
};

export const getActividadReciente = async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT s.accion, s.create_time, p.numero_guia, u.nombre AS usuario
      FROM seguimiento s
      JOIN paquetes p ON s.id_paquete = p.id_paquete
      JOIN usuarios u ON s.usuario_id = u.id
      ORDER BY s.create_time DESC
      LIMIT 10
    `);
    res.json(rows);
  } catch (err) {
    console.error("Error en actividad reciente:", err);
    res.status(500).json({ error: 'Error cargando actividad reciente' });
  }
};
