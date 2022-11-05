const express = require('express');
const router = express.Router();
const chatController = require('../controllers/chat.controller')

router.get('/get/room/:id', chatController.getRoomByID);
router.post('/get/joined/single-rooms', chatController.getJoinedRooms);

module.exports = router;