const express = require('express');
const router = express.Router();
const authController  = require('../controller/authController');
const { verifyToken } = require('../middleware/authMiddleware');

router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/logout', authController.logout);

// --- Route ที่ต้อง Login (ตัวอย่าง) ---
router.get('/profile', verifyToken, (req, res) => {
  // Middleware `verifyToken` จะทำงานก่อน
  // ถ้า Token ถูกต้อง เราจะสามารถเข้าถึงข้อมูล user ได้จาก req.user
  res.json({
    message: 'ยินดีต้อนรับสู่โปรไฟล์ของคุณ',
    user: req.user
  });
});

module.exports = router;