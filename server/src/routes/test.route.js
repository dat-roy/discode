const express = require('express');
const router = express.Router();
const testController = require('../controllers/test.controller')

router.get('/get', testController.testGet);
router.post('/post', testController.testPost);

module.exports = router;