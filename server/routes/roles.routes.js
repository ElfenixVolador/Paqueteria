// roles.routes.js
import express from 'express';
import {
  obtenerRoles,
  obtenerPermisos,
  crearRolConPermisos,
  eliminarRol,
  getPermisosPorRol
} from '../controllers/rol.controller.js';

const router = express.Router();

router.get('/', obtenerRoles);
router.get('/permisos', obtenerPermisos);
router.get('/:id/permisos', getPermisosPorRol);
router.post('/', crearRolConPermisos);
router.delete('/:id', eliminarRol);

export default router;
