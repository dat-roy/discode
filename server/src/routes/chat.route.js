const express = require('express');
const router = express.Router();
const chatController = require('../controllers/chat.controller')

router.get('/get/room/:id', chatController.getRoomByID);
router.post('/get/joined/single-rooms', chatController.getJoinedRooms);
router.post('/get/common/single-rooms', chatController.getCommonSingleRooms);

module.exports = router;