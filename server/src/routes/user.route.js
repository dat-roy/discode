const express = require('express')
const router = express.Router();
const userController = require('../controllers/user.controller')
const checkSession = require('../middlewares/check-session')

//router.get('/auth/login', userController.login)

router.post('/auth/google-login', userController.verifyGoogleLogin)
router.get('/logout', userController.logout)
router.get('/get-me', checkSession, userController.getLoggedInUserData)

module.exports = router;