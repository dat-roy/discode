const express = require('express');
const channelController = require('../controllers/channel.controller');
const router = express.Router();


router.post('/create', channelController.createChannel);
router.post('/remove', channelController.deleteChannel);
router.post('/remove-member', channelController.deleteMember);
module.exports = router;