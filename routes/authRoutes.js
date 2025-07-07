const express = require('express');
const router = express.Router();
const authController  = require('../controller/authController');
const { verifyToken } = require('../middleware/authMiddleware');

router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/logout', authController.logout);

// --- Route ที่ต้อง Login (ตัวอย่าง) ---
router.get('/me', verifyToken, (req, res) => {
  res.status(200).json({
    message: 'ข้อมูลผู้ใช้',
    user: {
      id: req.user.userId,
      email: req.user.email,
      username: req.user.username
    }
  });
});

module.exports = router;