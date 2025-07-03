const userModel = require('../models/userModel');

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

exports.getUserById = async (req, res) => {
  try {
    const user = await userModel.findById(req.params.id);
    if (!user) {
      return res.status(404).json({
        status: 'fail',
        message: 'ไม่พบผู้ใช้ที่ระบุ'
      });
    }
    res.status(200).json({
      status: 'success',
      data: { user }
    });
  } catch (err) {
    console.error("Controller Error fetching user by ID:", err);
    res.status(500).json({
      status: 'error',
      message: 'เกิดข้อผิดพลาดในการดึงข้อมูลผู้ใช้'
    });
  }
};