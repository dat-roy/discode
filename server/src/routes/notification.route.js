const express = require('express');
const notificationController = require('../controllers/notification.controller');
const router = express.Router();

router.post('/notification', notificationController.createPostLikeNotify);

module.exports = router;