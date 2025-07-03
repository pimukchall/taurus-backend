const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const userModel = require('../models/userModel');

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
    console.error("Register Error:", error); 
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

    // สร้าง JWT Token
    const payload = { userId: user.id, email: user.email, username: user.username };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1d' });

    res.status(200).json({ message: 'เข้าสู่ระบบสำเร็จ', token });
  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({ message: 'เกิดข้อผิดพลาดในระบบ' });
  }
};

const { tokenDenylist } = require('../middleware/authMiddleware');

exports.logout = (req, res) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // ดึง token จาก 'Bearer <token>'

    if (token) {
      tokenDenylist.add(token);
    }
    
    res.status(200).json({ message: 'ออกจากระบบสำเร็จ' });
  } catch (error) {
    res.status(500).json({ message: 'เกิดข้อผิดพลาดในระบบ' });
  }
};