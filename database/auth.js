const mysql = require('mysql2');

// สร้าง connection pool
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_AUTH,
  port: process.env.DB_PORT,
  waitForConnections: true,
  connectionLimit: 10, // จำกัดจำนวนการเชื่อมต่อพร้อมกัน
  queueLimit: 0
});

// Export pool
module.exports = { pool };