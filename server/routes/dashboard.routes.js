// server/routes/dashboard.routes.js
import express from 'express';
import { getResumen } from '../controllers/dashboard.controller.js'; // nombre exacto del archivo

const router = express.Router();

router.get('/resumen', getResumen);

export default router;
