import pool from '../lib/db.js';

// 1. Resumen general para tarjetas
export async function getResumen(req, res) {
  try {
    const [total] = await pool.query('SELECT COUNT(*) AS total FROM paquetes');

    const [hoy] = await pool.query(`
      SELECT COUNT(*) AS cantidad FROM paquetes 
      WHERE DATE(fecha_recepcion) = CURDATE()
    `);

    const [entregados] = await pool.query(`
      SELECT COUNT(*) AS cantidad FROM paquetes
      WHERE entregado = 1
    `);

    const totalPaquetes = total[0]?.total || 0;
    const paquetesHoy = hoy[0]?.cantidad || 0;
    const entregadosCount = entregados[0]?.cantidad || 0;
    const pendientes = totalPaquetes - entregadosCount;

    res.json({ totalPaquetes, paquetesHoy, entregados: entregadosCount, pendientes });
  } catch (error) {
    console.error('Error en resumen:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
}

// 2. Gráfico de paquetes por día (recibidos y entregados)
export async function getPaquetesPorDia(req, res) {
  const { dias = 7 } = req.query;

  try {
    const [result] = await pool.query(`
      SELECT
        DATE(fecha_recepcion) AS fecha,
        COUNT(*) AS recibidos,
        SUM(entregado = 1) AS entregados
      FROM paquetes
      WHERE fecha_recepcion >= DATE_SUB(CURDATE(), INTERVAL ? DAY)
      GROUP BY DATE(fecha_recepcion)
      ORDER BY fecha ASC
    `, [dias]);

    const formatted = result.map(r => ({
      fecha: new Date(r.fecha).toLocaleDateString('es-MX', { day: '2-digit', month: 'short' }),
      recibidos: r.recibidos,
      entregados: r.entregados
    }));

    res.json(formatted);
  } catch (error) {
    console.error("Error en getPaquetesPorDia:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
}

// 3. Actividad reciente para mostrar eventos en el dashboard
export async function getActividadReciente(req, res) {
  try {
    const [ultimosPaquetes] = await pool.query(`
      SELECT numero_guia AS guia, fecha_recepcion AS fecha, estado
      FROM paquetes
      ORDER BY fecha_recepcion DESC
      LIMIT 5
    `);

    const actividad = ultimosPaquetes.map(p => ({
      tipo: 'paquete',
      guia: p.guia,
      estado: p.estado,
      fecha: p.fecha
    }));

    res.json(actividad);
  } catch (err) {
    console.error("Error en actividad reciente:", err);
    res.status(500).json({ error: 'Error cargando actividad reciente' });
  }
}

// 4. Lista de paquetes recientes (para tabla del dashboard)
export async function getPaquetesRecientes(req, res) {
  try {
    const [paquetes] = await pool.query(`
      SELECT numero_guia AS guia, remitente, destinatario, fecha_recepcion AS fecha, estado
      FROM paquetes
      ORDER BY fecha_recepcion DESC
      LIMIT 5
    `);

    res.json(paquetes);
  } catch (err) {
    console.error("Error en paquetes recientes:", err);
    res.status(500).json({ error: 'Error al obtener paquetes recientes' });
  }
}
