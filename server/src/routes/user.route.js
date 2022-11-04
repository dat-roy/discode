const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');
const checkSession = require('../middlewares/check-session');

router.post('/auth/google-login', userController.verifyGoogleLogin);
router.post('/auth/register', userController.registerNewAccount);
router.get('/get', userController.getUserByUniqueKey);

module.exports = router;