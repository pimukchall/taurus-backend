const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const userModel = require('../models/userModel');
const { validateRegisterInput } = require('../validators/authValidator');

exports.register = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    const validationError = validateRegisterInput(req.body);
    if (validationError) {
      return res.status(400).json({ message: validationError });
    }

    const existingUserByEmail = await userModel.findUserByEmail(email);
    if (existingUserByEmail) {
      return res.status(409).json({ message: 'อีเมลนี้ถูกใช้งานแล้ว' });
    }

    const existingUserByUsername = await userModel.findUserByUsername(username);
    if (existingUserByUsername) {
      return res.status(409).json({ message: 'ชื่อผู้ใช้นี้ถูกใช้งานแล้ว' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    
    // IMPORTANT: Pass username to createUser
    const userId = await userModel.createUser(username, email, hashedPassword); 

    // Optional: Generate and send JWT for immediate login
    // if (!process.env.JWT_SECRET) {
    //   console.warn("JWT_SECRET is not defined. JWT token will not be generated.");
    // }
    // const token = jwt.sign({ userId: userId }, process.env.JWT_SECRET, { expiresIn: '1h' });
    // res.status(201).json({ message: 'สมัครสมาชิกสำเร็จ', userId, token });

    res.status(201).json({ message: 'สมัครสมาชิกสำเร็จ', userId }); // If not sending JWT immediately

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