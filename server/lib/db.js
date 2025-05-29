// server/lib/db.js
import mysql from 'mysql2/promise';
import config from '../config/index.js';

let pool;

export default async function connectDB() {
  if (!pool) {
    pool = await mysql.createPool({
      host:     config.db.host,
      user:     config.db.user,
      password: config.db.password,
      database: config.db.database,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0
    });
  }
  return pool;
}
