const express = require('express');
const router = express.Router();

const messageController = require('../controllers/message.controller')

router.post('/get/old', messageController.getOldMessages);
router.post('/save', messageController.saveNewMessage);

module.exports = router;