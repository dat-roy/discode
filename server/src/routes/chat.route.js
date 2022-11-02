const express = require('express');
const router = express.Router();
const chatController = require('../controllers/chat.controller')

router.post('/get/joined-conversations', chatController.getJoinedConversations);
router.get('/get/conversation/:id', chatController.getConversationByID)
module.exports = router;