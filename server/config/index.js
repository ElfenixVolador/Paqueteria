import dotenv from 'dotenv';
dotenv.config();

export default {
  port:   process.env.PORT || 3000,
  jwtKey: process.env.JWT_KEY,
  db: {
    host:     process.env.DB_HOST,
    user:     process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    name:     process.env.DB_NAME 
  }
};
