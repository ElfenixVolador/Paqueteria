// middleware/auth.middleware.js
import jwt from 'jsonwebtoken';
import config from '../config/index.js';

export function verifyToken(req, res, next) {
  const header = req.headers['authorization'];
  if (!header) {
    return res.status(403).json({ message: 'No token provided' });
  }

  const token = header.split(' ')[1]; // ✅ CORREGIDO

  try {
    const decoded = jwt.verify(token, config.jwtKey);
    req.userId = decoded.id;
    req.userRole = decoded.role; // opcional si usas permit
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid token' });
  }
}
