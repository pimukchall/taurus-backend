const express = require('express');
const router = express.Router();

const userController  = require('../controller/userController');

router.get('/', userController.getUsers);
router.get('/:id', userController.getUserById);
router.post('/register', userController.register);
router.post('/login', userController.login);

module.exports = router;