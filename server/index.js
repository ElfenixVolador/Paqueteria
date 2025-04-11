// index.js
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRouter from './routes/authRoutes.js';

dotenv.config();
const app = express();

app.use(cors({
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE"]
}));
app.use(express.json());

// Rutas de autenticación y paquetes
app.use('/auth', authRouter);

// Ruta raíz para verificar que el servidor esté activo
app.get('/', (req, res) => {
  res.send("Bienvenido al API");
});

// Levantar el servidor en el puerto definido en la variable de entorno o 3000
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is Running on port ${PORT}`);
});
