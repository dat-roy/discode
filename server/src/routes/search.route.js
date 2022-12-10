const express = require('express');
const searchController = require('../controllers/search.controller');
const router = express.Router();

router.post('/user/channel/not-in', searchController.searchUserNotInChannel);
router.get('/user/:param', searchController.searchUser);
router.get('/channel/:text', searchController.searchChannelByName);
router.get('/post/:text', searchController.searchPostByTitle);

module.exports = router;