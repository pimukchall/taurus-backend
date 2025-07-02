const express = require('express');
const router = express.Router();

const { getUsers, getUser, addUser, updateUser, deleteUser } = require('../../controller/auth/user');

router.get('/', getUsers);
router.get('/:user_id', getUser);
router.post('/', addUser);
router.put('/:user_id', updateUser);
router.delete('/:user_id', deleteUser);

module.exports = router;