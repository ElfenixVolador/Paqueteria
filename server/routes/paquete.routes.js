import { Router } from 'express';
import { verifyToken } from '../middleware/auth.middleware.js';
import { permit } from '../middleware/permit.js';
import {
  registrarPaquete,
  obtenerPaquetes,
  obtenerPaquetePorId,
  actualizarPaquete,
  eliminarPaquete
} from '../controllers/paquete.controller.js';

const router = Router();

// Admin y recepción pueden registrar paquetes
router.post('/registropaq', verifyToken, permit('admin', 'recepcion'), registrarPaquete);

// Todos pueden consultar paquetes (controlador filtra según rol)
router.get('/registropaq', verifyToken, permit('admin', 'recepcion', 'mensajero', 'usuario_final'), obtenerPaquetes);

// Obtener un paquete por ID → todos con acceso
router.get('/registropaq/:id', verifyToken, permit('admin', 'recepcion', 'mensajero', 'usuario_final'), obtenerPaquetePorId);

// Actualizar paquete → admin y recepción pueden
router.put('/registropaq/:id', verifyToken, permit('admin', 'recepcion'), actualizarPaquete);

// Eliminar paquete → solo admin
router.delete('/registropaq/:id', verifyToken, permit('admin'), eliminarPaquete);

export default router;
