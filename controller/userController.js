const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
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

exports.register = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: 'กรุณากรอกอีเมลและรหัสผ่าน' });
    }

    const existingUser = await userModel.findUserByEmail(email);
    if (existingUser) {
      return res.status(409).json({ message: 'อีเมลนี้ถูกใช้งานแล้ว' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const userId = await userModel.createUser(email, hashedPassword);

    res.status(201).json({ message: 'สมัครสมาชิกสำเร็จ', userId });
  } catch (error) {
    res.status(500).json({ message: 'เกิดข้อผิดพลาดในระบบ' });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: 'กรุณากรอกอีเมลและรหัสผ่าน' });
    }

    const user = await userModel.findUserByEmail(email);
    if (!user) {
      return res.status(401).json({ message: 'อีเมลหรือรหัสผ่านไม่ถูกต้อง' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'อีเมลหรือรหัสผ่านไม่ถูกต้อง' });
    }

    const payload = { userId: user.id, email: user.email };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1d' });

    res.status(200).json({ message: 'เข้าสู่ระบบสำเร็จ', token });
  } catch (error) {
    res.status(500).json({ message: 'เกิดข้อผิดพลาดในระบบ' });
  }
};