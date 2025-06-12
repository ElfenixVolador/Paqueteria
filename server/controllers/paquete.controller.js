import db from '../lib/db.js';

// REGISTRAR PAQUETE
export const registrarPaquete = async (req, res) => {
  const {
    empresa, remitente, contacto, telefono, destinatario, area_destino,
    descripcion, numero_guia, empresa_paqueteria, fecha_recepcion,
    estado, recibido_por, notas, usuario_id
  } = req.body;

  if (!remitente || !destinatario || !area_destino || !numero_guia || !empresa_paqueteria || !estado) {
    return res.status(400).json({ message: "Todos los campos obligatorios deben ser completados" });
  }

  try {
    const [result] = await db.query(`
      INSERT INTO paquetes (
        empresa, remitente, contacto, telefono, destinatario,
        area_destino, descripcion, numero_guia, empresa_paqueteria,
        fecha_recepcion, estado, recibido_por, notas, usuario_id
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        empresa || null, remitente, contacto || null, telefono || null,
        destinatario, area_destino, descripcion || null, numero_guia,
        empresa_paqueteria, fecha_recepcion || null, estado,
        recibido_por || null, notas || null, usuario_id || null
      ]
    );

    await db.query(
      'INSERT INTO seguimiento (id_paquete, estado, observaciones) VALUES (?, ?, ?)',
      [result.insertId, estado, 'Paquete creado automáticamente']
    );

    res.status(201).json({ message: "Paquete registrado con éxito" });
  } catch (error) {
    console.error("Error al registrar el paquete:", error);
    res.status(500).json({ message: "Error en el servidor" });
  }
};

// OBTENER PAQUETES
export const obtenerPaquetes = async (req, res) => {
  try {
    const usuarioId = req.query.usuario_id;

    const [rows] = usuarioId
      ? await db.query("SELECT * FROM paquetes WHERE usuario_id = ?", [usuarioId])
      : await db.query("SELECT * FROM paquetes");

    res.status(200).json(rows);
  } catch (error) {
    console.error("Error al obtener paquetes:", error);
    res.status(500).json({ message: "Error en el servidor" });
  }
};

// OBTENER PAQUETE POR ID
export const obtenerPaquetePorId = async (req, res) => {
  const { id } = req.params;
  try {
    const [rows] = await db.query("SELECT * FROM paquetes WHERE id_paquete = ?", [id]);
    if (rows.length === 0) {
      return res.status(404).json({ message: "Paquete no encontrado" });
    }
    res.status(200).json(rows[0]);
  } catch (error) {
    console.error("Error al obtener el paquete:", error);
    res.status(500).json({ message: "Error en el servidor" });
  }
};

// ACTUALIZAR PAQUETE
export const actualizarPaquete = async (req, res) => {
  const { id } = req.params;
  const {
    empresa, remitente, contacto, telefono, destinatario, area_destino,
    descripcion, numero_guia, empresa_paqueteria, fecha_recepcion,
    estado, recibido_por, notas
  } = req.body;

  try {
    const [result] = await db.query(`
      UPDATE paquetes SET
        empresa = ?, remitente = ?, contacto = ?, telefono = ?,
        destinatario = ?, area_destino = ?, descripcion = ?, numero_guia = ?,
        empresa_paqueteria = ?, fecha_recepcion = ?, estado = ?,
        recibido_por = ?, notas = ?
      WHERE id_paquete = ?`,
      [
        empresa || null, remitente, contacto || null, telefono || null,
        destinatario, area_destino, descripcion || null, numero_guia,
        empresa_paqueteria, fecha_recepcion || null, estado,
        recibido_por || null, notas || null, id
      ]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Paquete no encontrado" });
    }

    res.status(200).json({ message: "Paquete actualizado con éxito" });
  } catch (error) {
    console.error("Error al actualizar el paquete:", error);
    res.status(500).json({ message: "Error en el servidor" });
  }
};

// ACTUALIZAR ESTADO
export const actualizarEstadoPaquete = async (req, res) => {
  const { id } = req.params;
  const { estado, observaciones } = req.body;

  if (!estado) {
    return res.status(400).json({ message: "El campo 'estado' es obligatorio" });
  }

  try {
    const [result] = await db.query(
      'UPDATE paquetes SET estado = ? WHERE id_paquete = ?',
      [estado, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Paquete no encontrado" });
    }

    await db.query(
      'INSERT INTO seguimiento (id_paquete, estado, observaciones) VALUES (?, ?, ?)',
      [id, estado, observaciones || 'Estado actualizado manualmente']
    );

    res.status(200).json({ message: "Estado actualizado y seguimiento registrado" });
  } catch (error) {
    console.error("Error al actualizar estado del paquete:", error);
    res.status(500).json({ message: "Error en el servidor" });
  }
};

// ELIMINAR PAQUETE
export const eliminarPaquete = async (req, res) => {
  const { id } = req.params;
  try {
    const [result] = await db.query("DELETE FROM paquetes WHERE id_paquete = ?", [id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Paquete no encontrado" });
    }
    res.status(200).json({ message: "Paquete eliminado con éxito" });
  } catch (error) {
    console.error("Error al eliminar el paquete:", error);
    res.status(500).json({ message: "Error en el servidor" });
  }
};
