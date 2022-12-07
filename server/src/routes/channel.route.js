const express = require('express');
const channelController = require('../controllers/channel.controller');
const router = express.Router();
const upload = require('../middlewares/upload-image');

const saved_image_folder = "channel"
const avatar_field = "avatar"
const background_field = "background"

router.get('/:id', channelController.getChannelById);
router.post('/create',
    upload(saved_image_folder).fields([
        { name: avatar_field, maxCount: 1 },
        { name: background_field, maxCount: 1 },
    ]),
    channelController.createChannel);
router.post('/remove', channelController.deleteChannel);
router.post('/invite', channelController.inviteMember);
router.post('/invite/reply', channelController.replyInvitation);
router.post('/request/reply', channelController.replyJoiningRequest);
router.post('/add-member', channelController.addMember);
router.post('/remove-member', channelController.deleteMember);
router.post('/get/members', channelController.getMembers);
router.post('/get/joined-channels', channelController.getJoinedChannels);
router.post('/get/rooms', channelController.getGroupRooms);
router.get('/get/room/:id', channelController.getRoomById);
router.post('/create/room', channelController.createGroupRoom);
router.get('/check/title/:title', channelController.checkTitleExistence);

router.get('/get/feature', channelController.getFeaturedChannels);

module.exports = router;