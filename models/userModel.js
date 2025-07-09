const { pool } = require('../config/database');

exports.findAll = async () => {
  const sql = "SELECT id, username, email, created_at, updated_at FROM users";
  const [rows] = await pool.query(sql);
  return rows;
};

exports.findById = async (id) => {
  const sql = "SELECT id, username, email, created_at, updated_at FROM users WHERE id = ?";
  const [rows] = await pool.query(sql, [id]);
  return rows[0] || null;
};

exports.createUser = async (username, email, hashedPassword) => {
  const sql = `
    INSERT INTO users (username, email, password, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?)
  `;
  const [result] = await pool.query(sql, [
    username,
    email,
    hashedPassword,
    new Date(),
    new Date()
  ]);
  return result.insertId;
};

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

exports.updateUser = async (id, username, email) => {
  const sql = "UPDATE users SET username = ?, email = ? WHERE id = ?";
  const [result] = await pool.query(sql, [username, email, id]);
  return result.affectedRows > 0;
};

exports.deleteUser = async (id) => {
  const sql = "DELETE FROM users WHERE id = ?";
  const [result] = await pool.query(sql, [id]);
  return result.affectedRows > 0;
};
