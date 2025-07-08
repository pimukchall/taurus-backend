const pool = require('../config/database').pool;

// ฟังก์ชันสำหรับดึงข้อมูลผู้ใช้ทั้งหมด
exports.findAll = async () => {
  const query = "SELECT id, username, email, created_at FROM `users`";
  const [rows] = await pool.query(query);
  return rows;
};

// ฟังก์ชันสำหรับดึงข้อมูลผู้ใช้ด้วย ID
exports.findById = async (id) => {
  const query = "SELECT id, username, email, created_at FROM `users` WHERE id = ?";
  const [rows] = await pool.query(query, [id]);
  return rows[0] || null;
};

// ฟังก์ชันสำหรับสร้างผู้ใช้ใหม่
exports.createUser = async (username, email, hashedPassword) => {
  const sql = "INSERT INTO users (username, email, password, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?)";
  const [result] = await pool.query(sql, [username, email, hashedPassword, new Date(), new Date()]);
  return result.insertId;
};

// ฟังก์ชันสำหรับค้นหาผู้ใช้ด้วยอีเมล
exports.findUserByEmail = async (email) => {
  const sql = "SELECT * FROM users WHERE email = ? LIMIT 1";
  const [rows] = await pool.query(sql, [email]);
  return rows[0] || null;
};

exports.findUserByUsername = async (username) => {
  const sql = "SELECT * FROM users WHERE username = ? LIMIT 1";
  const [rows] = await pool.query(sql, [username]);
  return rows[0] || null;
};

// ฟังก์ชันสำหรับอัปเดตข้อมูลผู้ใช้
exports.updateUser = async (id, username, email) => {
  const sql = "UPDATE users SET username = ?, email = ? WHERE id = ?";
  const [result] = await pool.query(sql, [username, email, id]);
  return result.affectedRows > 0;
}

// ฟังก์ชันสำหรับลบผู้ใช้
exports.deleteUser = async (id) => {
  const sql = "DELETE FROM users WHERE id = ?";
  const [result] = await pool.query(sql, [id]);
  return result.affectedRows > 0;
}