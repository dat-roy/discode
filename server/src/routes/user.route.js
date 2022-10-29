const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');
const checkSession = require('../middlewares/check-session');

router.get('/test/get', userController.testGet);
router.post('/test/post', userController.testPost);
router.post('/auth/google-login', userController.verifyGoogleLogin);
router.post('/auth/register', userController.registerNewAccount);
router.get('/get-me', checkSession, userController.getLoggedInUserData);

module.exports = router;