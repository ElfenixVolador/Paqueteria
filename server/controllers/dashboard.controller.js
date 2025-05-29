// server/controllers/dashboard.controller.js
import db from '../lib/db.js'; // Usa tu conexión MySQL aquí

export async function getResumen(req, res) {
  try {
    const [total] = await db.query('SELECT COUNT(*) AS total FROM paquetes');

    const [hoy] = await db.query(`
      SELECT COUNT(*) AS cantidad FROM paquetes 
      WHERE DATE(fecha_recepcion) = CURDATE()
    `);

    const [entregados] = await db.query(`
      SELECT COUNT(*) AS cantidad FROM paquetes
      WHERE entregado = 1
    `);

    const totalPaquetes = total[0].total;
    const paquetesHoy = hoy[0].cantidad;
    const entregadosCount = entregados[0].cantidad;
    const pendientes = totalPaquetes - entregadosCount;

    res.json({
      totalPaquetes,
      paquetesHoy,
      entregados: entregadosCount,
      pendientes
    });
  } catch (error) {
    console.error('Error en resumen:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
}
