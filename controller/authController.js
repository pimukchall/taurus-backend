const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const userModel = require('../models/userModel');
const { validateRegisterInput, validateLoginInput, validateForgotPasswordInput, validateResetPasswordInput } = require('../validators/authValidator');

exports.register = async (req, res) => {
  try {
    // 1. Validate user input
    const validationError = validateRegisterInput(req.body);
    if (validationError) {
      return res.status(400).json({ message: validationError });
    }

    const { username, email, password } = req.body;

    // 2. Check for existing users
    const existingUserByEmail = await userModel.findUserByEmail(email);
    if (existingUserByEmail) {
      return res.status(409).json({ message: 'อีเมลนี้ถูกใช้งานแล้ว' });
    }

    const existingUserByUsername = await userModel.findUserByUsername(username);
    if (existingUserByUsername) {
      return res.status(409).json({ message: 'ชื่อผู้ใช้นี้ถูกใช้งานแล้ว' });
    }

    // 3. Hash password and create user
    const hashedPassword = await bcrypt.hash(password, 10);
    const userId = await userModel.createUser(username, email, hashedPassword); 

    // 4. Send success response
    res.status(201).json({ message: 'สมัครสมาชิกสำเร็จ', userId });

  } catch (error) {
    console.error("Register Error:", error); 
    res.status(500).json({ message: 'เกิดข้อผิดพลาดในระบบ' });
  }
};

exports.login = async (req, res) => {
  try {
    // 1. Validate user input using the refactored validator
    const validationError = validateLoginInput(req.body);
    if (validationError) {
      return res.status(400).json({ message: validationError });
    }

    const { email, password } = req.body;

    // 2. Check if user exists
    const user = await userModel.findUserByEmail(email);
    if (!user) {
      return res.status(401).json({ message: 'อีเมลหรือรหัสผ่านไม่ถูกต้อง' });
    }

    // 3. Check if password is correct
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'อีเมลหรือรหัสผ่านไม่ถูกต้อง' });
    }

    // 4. Create and sign JWT
    const payload = { userId: user.id, email: user.email, username: user.username };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1d' });

    // 5. Send token to client
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