import express from 'express';
import {
  getAllSeguimientos,
  getSeguimientosByPaquete,
  addSeguimiento,
  getResumenEstados
} from '../controllers/seguimiento.controller.js';

const router = express.Router();

router.get('/', getAllSeguimientos);
router.get('/:id_paquete', getSeguimientosByPaquete);
router.post('/', addSeguimiento);
router.get('/resumen/estado', getResumenEstados);

export default router;
