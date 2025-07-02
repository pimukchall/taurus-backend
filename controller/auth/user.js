const { pool } = require("../../database/auth");
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
  const userId = req.params.user_id;
  pool.query(
    "SELECT * FROM `users` WHERE `user_id` = ?",
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

exports.addUser = (req, res) => {
  const { username, password, email } = req.body;
  pool.query(
    "INSERT INTO `users` (`username`, `password`, `email`) VALUES (?, ?, ?)",
    [username, password, email],
    function (err, results, fields) {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.status(201).json({ message: "User created successfully", userId: results.insertId });
    }
  );
}

exports.updateUser = (req, res) => {
  const userId = req.params.user_id;
  const { username, password, email } = req.body;
  pool.query(
    "UPDATE `users` SET `username` = ?, `password` = ?, `email` = ? WHERE `user_id` = ?",
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
  const userId = req.params.user_id;
  pool.query(
    "DELETE FROM `users` WHERE `user_id` = ?",
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