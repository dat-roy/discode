const express = require('express');
const messageController = require('../controllers/message.controller')
const router = express.Router();
const upload = require('../middlewares/upload-image');

const saved_image_folder = "msg"
const upload_image_field = "file"

router.post('/get/old', messageController.getOldMessages);
router.post('/mark/read', messageController.markMessagesAsRead);
router.get('/count/all/unread', messageController.countAllUnreadMessages);
router.post('/save', upload(saved_image_folder).single(upload_image_field), messageController.saveNewMessage);

module.exports = router;