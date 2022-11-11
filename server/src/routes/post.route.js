const express = require('express');
const router = express.Router();

const postController = require('../controllers/post.controller')

router.post('/save', postController.saveNewPost);
router.get('/get/by-post/:id', postController.getPostById);
router.get('/get/by-author/:id', postController.getPostsByAuthorId);
router.get('/count/likes/:id', postController.countLikesNumber);
router.post('/check-liked', postController.checkLiked);
router.post('/toggle/like', postController.toggleLiked);
router.get('/get/comment/:id', postController.getComments);

module.exports = router;