const { pool } = require("../../database/db");
console.log('[DEBUG] db loaded:', typeof pool.query);

exports.getUsers = (req, res) => {
  pool.query(
    "SELECT * FROM `users`",
    function (err, results, fields) {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json(results);
    }
  );
}

exports.getUser = (req, res) => {
  const userId = req.params.id;
  pool.query(
    "SELECT * FROM `users` WHERE `id` = ?",
    [userId],
    function (err, results, fields) {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      if (results.length === 0) {
        return res.status(404).json({ message: "User not found" });
      }
      res.json(results[0]);
    }
  );
} 

exports.updateUser = (req, res) => {
  const userId = req.params.id;
  const { username, password, email } = req.body;
  pool.query(
    "UPDATE `users` SET `username` = ?, `password` = ?, `email` = ? WHERE `id` = ?",
    [username, password, email, userId],
    function (err, results, fields) {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      if (results.affectedRows === 0) {
        return res.status(404).json({ message: "User not found" });
      }
      res.json({ message: "User updated successfully" });
    }
  );
}

exports.deleteUser = (req, res) => {
  const userId = req.params.id;
  pool.query(
    "DELETE FROM `users` WHERE `id` = ?",
    [userId],
    function (err, results, fields) {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      if (results.affectedRows === 0) {
        return res.status(404).json({ message: "User not found" });
      }
      res.json({ message: "User deleted successfully" });
    }
  );
}