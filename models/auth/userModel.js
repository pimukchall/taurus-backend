const pool = require('../../config/database').pool;

// ฟังก์ชันสำหรับดึงข้อมูลผู้ใช้ทั้งหมด
exports.findAll = async () => {
  const query = "SELECT id, username, email, created_at FROM `users`";
  const [rows] = await pool.query(query);
  return rows;
};