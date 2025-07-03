const express = require('express');
const router = express.Router();

const { addUser } = require('../../controller/auth/auth');

router.post('/register', addUser);

module.exports = router;