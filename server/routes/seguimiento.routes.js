import express from 'express';
import {
  getAllSeguimientos,
  getSeguimientosByPaquete,
  addSeguimiento,
  getResumenGrafica
} from '../controllers/seguimiento.controller.js';

const router = express.Router();

router.get('/', getAllSeguimientos); // Lista general
router.get('/:id_paquete', getSeguimientosByPaquete); // Por paquete
router.post('/', addSeguimiento); // Agregar seguimiento
router.get('/grafica/resumen', getResumenGrafica); // Para la gráfica

export default router;
