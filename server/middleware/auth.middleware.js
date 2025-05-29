// middleware/auth.middleware.js
import jwt from 'jsonwebtoken';
import config from '../config/index.js';

export function verifyToken(req, res, next) {
  const header = req.headers['authorization'];
  if (!header) {
    return res.status(403).json({ message: 'No token provided' });
  }

  const token = header.split(' ')[1];
  try {
    const decoded = jwt.verify(token, config.jwtKey);
    req.userId   = decoded.id;
    req.userRole = decoded.role;  // aquí guardamos el rol
    next();
  } catch (err) {
    res.status(401).json({ message: 'Invalid token' });
  }
}
