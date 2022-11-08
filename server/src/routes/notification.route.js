const express = require('express');
const notificationController = require('../controllers/notification.controller');
const router = express.Router();

router.post('/notification/like', notificationController.createPostLikeNotify);
router.post('/notification/comment', notificationController.createPostCommentNotify);

module.exports = router;