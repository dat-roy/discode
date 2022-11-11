const Posts = require("../models/posts.model");
const Tags = require('../models/tags.model')
const PostLikes = require('../models/post_likes.model')
const PostComments = require('../models/post_comments.model')

class postController {
    //[POST] /api/post/save
    async saveNewPost(req, res, next) {
        const { author_id, title, content, tag_list } = req.body;

        try {
            //TODO: validate author_id 

            if (!content) {
                return res.status(200).json({
                    message: "Content can not be empty",
                })
            }

            const postSaving = await Posts.create({
                author_id: author_id,
                title: title,
                content: content,
            })

            if (postSaving.affectedRows === 0) {
                throw new Error("DB error when saving");
            } else {
                const post_id = postSaving.insertId;
                if (tag_list) {
                    for (const tagname of tag_list) {
                        const tagSaving = await Tags.create({
                            post_id: post_id,
                            tag_name: tagname,
                        })
                    }
                }
                return res.status(200).json({
                    message: "Save new post successfully",
                    post_id: post_id,
                })
            }
        } catch (err) {
            console.log(err);
            return res.status(500).json({
                message: "Internal Server Error",
                error: err.message,
            })
        }
    }

    //[GET] /api/post/get/by-post/:id
    async getPostById(req, res, next) {
        const post_id = parseInt(req.params.id);
        try {
            const result = await Posts.fetchPostWithAuthor({
                post_id: post_id,
            })
            if (!result) {
                return res.status(404).json({
                    message: "Post id not found"
                })
            }

            return res.status(200).json({
                message: "Get a post successfully",
                post: result[0],
            })
        } catch (err) {
            console.log(err);
            return res.status(500).json({
                message: "Internal Server Error",
                error: err.message,
            })
        }
    }

    //[GET] /api/post/get/by-author/:id
    async getPostsByAuthorId(req, res, next) {
        const author_id = parseInt(req.params.id);

        try {
            //TODO: validate user_id
            const posts = await Posts.findAll({ where: { author_id: author_id } })

            for (const post of posts) {
                const tags = await Tags.findAll({ where: { post_id: post.id } })
                post.tags = tags;
            }

            return res.status(200).json({
                message: "Get all posts successfully",
                posts: posts,
            })
        } catch (err) {
            console.log(err);
            return res.status(500).json({
                message: "Internal Server Error",
                error: err.message,
            })
        }
    }

    //[GET] /api/post/count/likes/:id
    async countLikesNumber(req, res, next) {
        const post_id = parseInt(req.params.id);
        try {
            const result = await PostLikes.fetchLikesNumber({ post_id: post_id})
            return res.status(200).json(result)
        } catch (err) {
            console.log(err);
            return res.status(500).json({
                message: "Internal Server Error", 
                error: err.message, 
            })
        }
    }

    //[POST] /api/post/check-liked
    async checkLiked(req, res, next) {
        const post_id = parseInt(req.body.post_id)
        const user_id = parseInt(req.body.user_id)
        try {
            const result = await PostLikes.findOne({
                where:
                    `post_id=${post_id} AND user_id=${user_id}`,
            })
            //console.log(result);
            let liked;
            if (!result || !result.liked) {
                liked = false;
            } else {
                liked = true;
            }
            return res.status(200).json({
                message: "Get liked info successfully",
                liked: liked,
            })
        } catch (err) {
            console.log(err);
            return res.status(500).json({
                message: "Internal Server Error",
                error: err.message,
            })
        }
    }

    //[POST] /api/post/toggle/like
    async toggleLiked(req, res, next) {
        const user_id = parseInt(req.body.user_id);
        const post_id = parseInt(req.body.post_id);
        const {liked} = req.body;
        try {
            const result = await PostLikes.create({
                user_id: user_id, 
                post_id: post_id, 
                liked: liked, 
            })

            if (result.affectedRows === 0) {
                return res.status(200).json({
                    success: false, 
                }) 
            } else {
                return res.status(200).json({
                    success: true, 
                }) 
            }
        } catch (err) {
            console.log(err)
            return res.status(500).json({
                message: "Internal Server Error",
                error: err.message, 
            })
        }
    }

    //[GET] /api/post/get/comment/:id
    async getComments(req, res, next) {
        const post_id = parseInt(req.params.id)
        try {
            const comments = await PostComments.findAll({
                where: {
                    post_id: post_id, 
                }
            })
            return res.status(200).json({
                message: "Get all comments successfully", 
                comments: comments, 
            })
        } catch (err) {
            console.log(err);
            return res.status(500).json({
                message: "Internal Server Error", 
                error: err.message, 
            })
        }
    }
}

module.exports = new postController();