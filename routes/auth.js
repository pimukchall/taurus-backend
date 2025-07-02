const express = require('express');
const router = express.Router();

const { addUser } = require('../controller/auth/authController');

router.post('/register', addUser);

module.exports = router;