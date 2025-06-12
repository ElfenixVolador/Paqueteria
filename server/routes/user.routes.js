import express from 'express';
import { verifyToken } from '../middleware/auth.middleware.js';
import { permit } from '../middleware/permit.js';
import { getAllUsers, addUser, deleteUser, updateUser } from '../controllers/user.controller.js';

const router = express.Router();

// Solo admin puede ver todos los usuarios
router.get('/', verifyToken, permit('admin'), getAllUsers);

// Solo admin puede agregar usuarios
router.post('/', verifyToken, permit('admin'), addUser);

// Solo admin puede eliminar usuarios
router.delete('/:id', verifyToken, permit('admin'), deleteUser);

// Solo admin puede actualizar usuarios
router.put('/:id', verifyToken, permit('admin'), updateUser);

export default router;
