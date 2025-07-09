const express = require('express');
const router = express.Router();

const contactController = require('../controller/contactController');

router.get('/', contactController.getAllContactRequests);
router.get('/:id', contactController.getContactRequestById);
router.post('/', contactController.createContactRequest);
router.delete('/:id', contactController.deleteContactRequest);

module.exports = router;