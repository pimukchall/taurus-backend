const userModel = require('../../models/auth/userModel');

exports.getUsers = async (req, res) => {
  try {
    const users = await userModel.findAll();
    console.log("Fetched users:", users);
    res.status(200).json({
      status: 'success',
      count: users.length,
      data: {
        users: users
      }
    });
  } catch (err) {
    console.error("Controller Error fetching users:", err);
    res.status(500).json({
      status: 'error',
      message: 'เกิดข้อผิดพลาดในการดึงข้อมูลผู้ใช้'
    });
  }
};