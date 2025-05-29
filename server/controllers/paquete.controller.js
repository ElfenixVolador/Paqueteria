import connectDB from '../lib/db.js';

// Registrar un nuevo paquete (con seguimiento automático)
export const registrarPaquete = async (req, res) => {
  const {
    empresa, remitente, contacto, telefono, destinatario, area_destino,
    descripcion, numero_guia, empresa_paqueteria, fecha_recepcion,
    estado, recibido_por, notas
  } = req.body;

  if (!remitente || !destinatario || !area_destino || !numero_guia || !empresa_paqueteria || !estado) {
    return res.status(400).json({ message: "Todos los campos obligatorios deben ser completados" });
  }

  try {
    const db = await connectDB();
    const query = `
      INSERT INTO paquetes 
      (empresa, remitente, contacto, telefono, destinatario, area_destino, descripcion, numero_guia, empresa_paqueteria, fecha_recepcion, estado, recibido_por, notas) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    const values = [
      empresa || null, remitente, contacto || null, telefono || null,
      destinatario, area_destino, descripcion || null, numero_guia,
      empresa_paqueteria, fecha_recepcion || null, estado,
      recibido_por || null, notas || null
    ];

    const [result] = await db.query(query, values);
    const nuevoId = result.insertId;

    // Insertar en seguimiento automáticamente
    await db.query(
      'INSERT INTO seguimiento (id_paquete, estado, observaciones) VALUES (?, ?, ?)',
      [nuevoId, estado, 'Paquete creado automáticamente']
    );

    return res.status(201).json({ message: "Paquete registrado con éxito" });
  } catch (error) {
    console.error("Error al registrar el paquete:", error);
    return res.status(500).json({ message: "Error en el servidor" });
  }
};

// Obtener todos los paquetes
export const obtenerPaquetes = async (req, res) => {
  try {
    const db = await connectDB();
    const [rows] = await db.query("SELECT * FROM paquetes");
    return res.status(200).json(rows);
  } catch (error) {
    console.error("Error al obtener paquetes:", error);
    return res.status(500).json({ message: "Error en el servidor" });
  }
};

// Obtener un paquete por ID
export const obtenerPaquetePorId = async (req, res) => {
  const { id } = req.params;
  try {
    const db = await connectDB();
    const [rows] = await db.query("SELECT * FROM paquetes WHERE id_paquete = ?", [id]);
    if (rows.length === 0) {
      return res.status(404).json({ message: "Paquete no encontrado" });
    }
    return res.status(200).json(rows[0]);
  } catch (error) {
    console.error("Error al obtener el paquete:", error);
    return res.status(500).json({ message: "Error en el servidor" });
  }
};

// Actualizar un paquete completo
export const actualizarPaquete = async (req, res) => {
  const { id } = req.params;
  const {
    empresa, remitente, contacto, telefono, destinatario, area_destino,
    descripcion, numero_guia, empresa_paqueteria, fecha_recepcion,
    estado, recibido_por, notas
  } = req.body;

  try {
    const db = await connectDB();
    const query = `
      UPDATE paquetes 
      SET empresa = ?, remitente = ?, contacto = ?, telefono = ?, destinatario = ?, area_destino = ?, descripcion = ?, numero_guia = ?, empresa_paqueteria = ?, fecha_recepcion = ?, estado = ?, recibido_por = ?, notas = ?
      WHERE id_paquete = ?
    `;
    const values = [
      empresa || null, remitente, contacto || null, telefono || null,
      destinatario, area_destino, descripcion || null, numero_guia,
      empresa_paqueteria, fecha_recepcion || null, estado,
      recibido_por || null, notas || null, id
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
};

// Actualizar solo el estado + registrar seguimiento
export const actualizarEstadoPaquete = async (req, res) => {
  const { id } = req.params;
  const { estado, observaciones } = req.body;

  if (!estado) {
    return res.status(400).json({ message: "El campo 'estado' es obligatorio" });
  }

  try {
    const db = await connectDB();

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

    return res.status(200).json({ message: "Estado actualizado y seguimiento registrado" });
  } catch (error) {
    console.error("Error al actualizar estado del paquete:", error);
    return res.status(500).json({ message: "Error en el servidor" });
  }
};

// Eliminar un paquete
export const eliminarPaquete = async (req, res) => {
  const { id } = req.params;
  try {
    const db = await connectDB();
    const [result] = await db.query("DELETE FROM paquetes WHERE id_paquete = ?", [id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Paquete no encontrado" });
    }
    return res.status(200).json({ message: "Paquete eliminado con éxito" });
  } catch (error) {
    console.error("Error al eliminar el paquete:", error);
    return res.status(500).json({ message: "Error en el servidor" });
  }
};
