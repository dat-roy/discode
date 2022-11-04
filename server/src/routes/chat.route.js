const express = require('express');
const router = express.Router();
const chatController = require('../controllers/chat.controller')

router.get('/get/conversation/:id', chatController.getConversationByID);
router.post('/get/joined-conversations', chatController.getJoinedConversations);
router.post('/get/common-conversations', chatController.getCommonConversations);

module.exports = router;