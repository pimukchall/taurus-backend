const mysql = require('mysql2/promise');
require('dotenv').config();

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT || 3306,
  waitForConnections: true,
  connectionLimit: 10,
  maxIdle: 10,
  idleTimeout: 60000,
  queueLimit: 0,
  enableKeepAlive: true,
  keepAliveInitialDelay: 0,
});

pool.getConnection()
  .then(connection => {
    console.log('✅ Database connected successfully!');
    connection.release(); // คืน connection กลับสู่ pool
  })
  .catch(err => {
    console.error('❌ Unable to connect to the database:', err);
});

module.exports = {
  pool,
  query: async (sql, params) => {
    const [rows] = await pool.query(sql, params);
    return rows;
  },
  close: async () => {
    await pool.end();
    console.log('Database connection pool closed.');
  }
};

