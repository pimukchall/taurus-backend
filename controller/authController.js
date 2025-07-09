const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const userModel = require('../models/userModel');
const {
  validateRegisterInput,
  validateLoginInput,
  validateForgotPasswordInput,
  validateResetPasswordInput
} = require('../validators/authValidator');
const { tokenDenylist } = require('../middleware/authMiddleware');

exports.register = async (req, res) => {
  try {
    const validationError = validateRegisterInput(req.body);
    if (validationError) {
      return res.status(400).json({ message: validationError });
    }

    const { username, email, password } = req.body;

    const existingUserByEmail = await userModel.findUserByEmail(email);
    if (existingUserByEmail) {
      return res.status(409).json({ message: 'อีเมลนี้ถูกใช้งานแล้ว' });
    }

    const existingUserByUsername = await userModel.findUserByUsername(username);
    if (existingUserByUsername) {
      return res.status(409).json({ message: 'ชื่อผู้ใช้นี้ถูกใช้งานแล้ว' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const userId = await userModel.createUser(username, email, hashedPassword);

    res.status(201).json({ message: 'สมัครสมาชิกสำเร็จ', userId });
  } catch (error) {
    console.error("Register Error:", error);
    res.status(500).json({ message: 'เกิดข้อผิดพลาดในระบบ' });
  }
};

exports.login = async (req, res) => {
  try {
    const validationError = validateLoginInput(req.body);
    if (validationError) {
      return res.status(400).json({ message: validationError });
    }

    const { email, password, rememberMe } = req.body;

    const user = await userModel.findUserByEmail(email);
    if (!user) {
      return res.status(401).json({ message: 'อีเมลหรือรหัสผ่านไม่ถูกต้อง' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'อีเมลหรือรหัสผ่านไม่ถูกต้อง' });
    }

    const payload = {
      userId: user.id,
      email: user.email,
      username: user.username,
    };

    const expiresIn = rememberMe ? '7d' : '1d';
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn });

    res.status(200).json({
      message: 'เข้าสู่ระบบสำเร็จ',
      token,
      expiresIn,
      user: {
        userId: user.id,
        username: user.username,
        email: user.email,
        created_at: user.created_at,
        updated_at: user.updated_at,
      },
    });
  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({ message: 'เกิดข้อผิดพลาดในระบบ' });
  }
};

exports.me = async (req, res) => {
  try {
    const user = await userModel.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({ message: 'ไม่พบผู้ใช้' });
    }

    res.status(200).json({
      message: 'ข้อมูลผู้ใช้',
      user: {
        userId: user.id,
        username: user.username,
        email: user.email,
        created_at: user.created_at,
        updated_at: user.updated_at,
      },
    });
  } catch (err) {
    console.error("Me Error:", err);
    res.status(500).json({ message: 'เกิดข้อผิดพลาดในระบบ' });
  }
};

exports.logout = (req, res) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (token) {
      tokenDenylist.add(token);
    }

    res.status(200).json({ message: 'ออกจากระบบสำเร็จ' });
  } catch (error) {
    console.error("Logout Error:", error);
    res.status(500).json({ message: 'เกิดข้อผิดพลาดในระบบ' });
  }
};
