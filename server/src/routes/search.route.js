const express = require('express');
const searchController = require('../controllers/search.controller');
const router = express.Router();

router.get('/user', searchController.searchUser)

module.exports = router;