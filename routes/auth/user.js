const express = require('express');
const router = express.Router();

const { getUsers, getUser, updateUser, deleteUser} = require('../../controller/auth/user');

router.get('/', getUsers);
router.get('/:id', getUser);
router.put('/:id', updateUser);
router.delete('/:id', deleteUser);

module.exports = router;