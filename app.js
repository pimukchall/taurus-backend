const path = require('path');
const fs = require('fs');
const dotenv = require('dotenv');
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

// โหลด environment variables ตาม NODE_ENV
const env = process.env.NODE_ENV || 'development';
const envPath = path.resolve(__dirname, `.env.${env}`);

if (fs.existsSync(envPath)) {
  dotenv.config({ path: envPath });
  console.log(`✔ Loaded environment: ${env}`);
} else {
  console.warn(`⚠ No .env file found for environment: ${env}`);
}

// นำเข้า route modules
const authRouter = require('./routes/authRoutes');
const contactRouter = require('./routes/contactRoutes');
const usersRouter = require('./routes/userRoutes');

const app = express();

// ตั้งค่า CORS อย่างปลอดภัย
const allowedOrigin = process.env.HTTP || 'http://localhost:3000';
app.set('trust proxy', true);
app.use(cors({
  origin: allowedOrigin,
  credentials: true,
  methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// ตั้งค่า middleware พื้นฐาน
app.use(logger('dev'));
app.use(express.json({ charset: 'utf-8' }));
app.use(express.urlencoded({ extended: true, charset: 'utf-8' }));
app.use(cookieParser());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ตั้งค่า routes
app.use('/auth', authRouter);
app.use('/contact', contactRouter);
app.use('/users', usersRouter);

app.get('/', (req, res) => {
  res.send('Welcome to Taurus Backend API');
});

// เริ่มต้น server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});
