const express = require('express');
const searchController = require('../controllers/search.controller');
const router = express.Router();

router.post('/user/channel/not-in', searchController.searchUserNotInChannel);
router.get('/user/:param', searchController.searchUser)

module.exports = router;