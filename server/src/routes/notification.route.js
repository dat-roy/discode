const express = require('express');
const notificationController = require('../controllers/notification.controller');
const router = express.Router();

// router.post('/like', notificationController.createPostLikeNotify);
// router.post('/comment', notificationController.createPostCommentNotify);
// router.post('/invite', notificationController.createInviteUserNotify);
router.post('/get/global', notificationController.getGlobalNotis);
router.post('/get/channel/requests', notificationController.getChannelRequests);
router.post('/read/one', notificationController.markOneAsRead);
router.post('/read/all', notificationController.markAllAsRead);

module.exports = router;