const express = require('express');
const router = express.Router();

const messageController = require('../controllers/message.controller')
const upload = require('../middlewares/upload-image');
const saved_image_folder = "msg"
const upload_image_field = "file"

router.post('/get/old', messageController.getOldMessages);
router.post('/save', upload(saved_image_folder).single(upload_image_field), messageController.saveNewMessage);

module.exports = router;