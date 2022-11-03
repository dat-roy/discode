const express = require('express');
const conversationController = require('../controllers/conversation.controller');
const router = express.Router();


router.post('/create', conversationController.createChannel);
router.post('/remove', conversationController.deleteChannel);
module.exports = router;