import express from 'express';
import { verifyToken } from '../middleware/auth.middleware.js';
import { permit } from '../middleware/permit.js';

import {
  getResumen,
  getPaquetesPorDia,
  getActividadReciente,
  getPaquetesRecientes
} from '../controllers/dashboard.controller.js';

const router = express.Router();

// Agregamos todos los endpoints de dashboard
router.get('/resumen', verifyToken, permit('admin', 'recepcion', 'mensajero', 'usuario_final'), getResumen);
router.get('/por-dia', verifyToken, permit('admin', 'recepcion', 'mensajero', 'usuario_final'), getPaquetesPorDia);
router.get('/actividad', verifyToken, permit('admin', 'recepcion', 'mensajero', 'usuario_final'), getActividadReciente);
router.get('/recientes', verifyToken, permit('admin', 'recepcion', 'mensajero', 'usuario_final'), getPaquetesRecientes);

export default router;
