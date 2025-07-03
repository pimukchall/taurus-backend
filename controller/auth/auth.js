const dbPool = require('../../database/db');

exports.addUser = async (req, res) => {

  const { username, password, email } = req.body;

  try {
    const sql = "INSERT INTO `users` (`username`, `password`, `email`) VALUES (?, ?, ?)";
    
    const [results] = await dbPool.execute(sql, [username, password, email]);

    res.status(201).json({ 
      message: "User created successfully", 
      userId: results.insertId 
    });

  } catch (err) {
    console.error("Database Error:", err);
    res.status(500).json({ error: err.message });
  }
};