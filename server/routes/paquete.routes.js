// routes/paquetes.routes.js
import { Router } from 'express';
import { verifyToken } from '../middleware/auth.middleware.js';
import { permit }      from '../middleware/permit.js';
import {
  registrarPaquete,
  obtenerPaquetes,
  obtenerPaquetePorId,
  actualizarPaquete,
  eliminarPaquete
} from '../controllers/paquete.controller.js';

const router = Router();

router.post   ('/registropaq',     verifyToken, registrarPaquete);
router.get    ('/registropaq',     verifyToken, obtenerPaquetes);
router.get    ('/registropaq/:id', verifyToken, obtenerPaquetePorId);
router.put    ('/registropaq/:id', verifyToken, permit('admin','user'), actualizarPaquete);
router.delete ('/registropaq/:id', verifyToken, permit('admin'), eliminarPaquete);

export default router;
