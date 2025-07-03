const express = require('express');
const router = express.Router();

const { getUsers } = require('../../controller/auth/userController');

router.get('/', getUsers);

module.exports = router;