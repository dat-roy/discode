const express = require('express');
const channelController = require('../controllers/channel.controller');
const router = express.Router();

router.post('/create', channelController.createChannel);
router.post('/remove', channelController.deleteChannel);
router.post('/invite', channelController.inviteMember);
router.post('/add-member', channelController.addMember);
router.post('/remove-member', channelController.deleteMember);
module.exports = router;