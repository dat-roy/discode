const express = require('express');
const router = express.Router();

const postController = require('../controllers/post.controller')

router.post('/save', postController.saveNewPost);
router.get('/get/by-post/:id', postController.getPostById);
router.get('/get/by-author/:id', postController.getPostsByAuthorId);
router.get('/get/tags/:post_id', postController.getTags);
router.get('/count/likes/:id', postController.countLikesNumber);
router.post('/check-liked', postController.checkLiked);
router.post('/toggle/like', postController.toggleLiked);
router.get('/comment/get/:id', postController.getComments);
router.post('/comment/save', postController.saveNewComment);

router.get('/get/featured/authors', postController.getFeaturedAuthors);
router.get('/get/featured/topics', postController.getFeaturedTopics);
router.get('/get/featured/posts', postController.getHotPosts);

module.exports = router;