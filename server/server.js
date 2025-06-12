import express from 'express';
import dotenv from 'dotenv';
dotenv.config();

import cors from 'cors';
import morgan from 'morgan';
import './lib/db.js'; // SOLO IMPORTAMOS el pool para que se ejecute
import config from './config/index.js';

// Rutas
import authRoutes from './routes/auth.routes.js';
import paqueteRoutes from './routes/paquete.routes.js';
import dashboardRoutes from './routes/dashboard.routes.js';
import userRoutes from './routes/user.routes.js';
import seguimientoRoutes from './routes/seguimiento.routes.js';
import rolRoutes from './routes/roles.routes.js';


// Middleware de errores
import errorHandler from './middleware/error.middleware.js';

function main() {
  const app = express();

  // 1) Middlewares globales
  app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
  }));
  app.use(morgan('dev'));
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // 2) Rutas API
  app.use('/api/auth', authRoutes);
  app.use('/api/paquetes', paqueteRoutes);
  app.use('/api/dashboard', dashboardRoutes);
  app.use('/api/users', userRoutes);
  app.use('/api/seguimiento', seguimientoRoutes);
  app.use('/api/roles', rolRoutes);  

  // 3) Manejador de errores
  app.use(errorHandler);

  // 4) Iniciar servidor
  app.listen(config.port, () => {
    console.log(`Servidor corriendo en http://localhost:${config.port}`);
  });
}

main();
