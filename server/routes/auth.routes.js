// server/routes/auth.routes.js
import { Router } from 'express';
import { register, login, me } from '../controllers/auth.controller.js';
import { verifyToken }         from '../middleware/auth.middleware.js';

const router = Router();
router.post('/register', register);
router.post('/login',    login);
router.get('/home',      verifyToken, me);
export default router;
