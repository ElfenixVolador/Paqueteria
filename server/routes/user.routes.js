import express from 'express';
import { getAllUsers, addUser, deleteUser, updateUser } from '../controllers/user.controller.js';

const router = express.Router();

router.get('/', getAllUsers);
router.post('/', addUser);
router.delete('/:id', deleteUser);
router.put('/:id', updateUser);

export default router;
