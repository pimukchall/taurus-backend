const jwt = require('jsonwebtoken');

const tokenDenylist = new Set();

const verifyToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'ไม่พบ Token' });
  }

  // ตรวจสอบว่า Token อยู่ใน Denylist หรือไม่
  if (tokenDenylist.has(token)) {
      return res.status(401).json({ message: 'Token นี้ถูกยกเลิกแล้ว (ออกจากระบบ)' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: 'Token ไม่ถูกต้อง' });
    }
    req.user = decoded; // เก็บข้อมูล user ที่ถอดรหัสแล้วไว้ใน req
    next();
  });
};

// ทำให้ denylist และ verifyToken สามารถเข้าถึงได้จากภายนอก
module.exports = { verifyToken, tokenDenylist };