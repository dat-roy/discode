const express = require('express');
const channelController = require('../controllers/channel.controller');
const router = express.Router();

router.get('/:id', channelController.getChannelById);
router.post('/create', channelController.createChannel);
router.post('/remove', channelController.deleteChannel);
router.post('/invite', channelController.inviteMember);
router.post('/add-member', channelController.addMember);
router.post('/remove-member', channelController.deleteMember);
router.post('/get/joined-channels', channelController.getJoinedChannels);
router.post('/get/rooms', channelController.getGroupRooms);
module.exports = router;