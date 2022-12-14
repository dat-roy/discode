const Users = require("../models/users.model");
const Posts = require("../models/posts.model");
const Tags = require('../models/tags.model')
const PostLikes = require('../models/post_likes.model')
const PostComments = require('../models/post_comments.model')
const Notifications = require('../models/notifications.model');
const NotificationReceiver = require('../models/notification_receivers.model')
const { PostNotificationTypes } = require("../types/db.type");

class postController {
    //[POST] /api/post/save
    async saveNewPost(req, res, next) {
        const { author_id, title, content, tag_list } = req.body;

        try {
            //TODO: validate author_id 

            if (!content) {
                return res.status(404).json({
                    message: "Content can not be empty",
                })
            }

            const postSaving = await Posts.create({
                author_id, title, content,
            })

            if (postSaving.affectedRows === 0) {
                throw new Error("DB error when saving");
            } else {
                const post_id = postSaving.insertId;
                if (tag_list) {
                    for (const tagname of tag_list) {
                        const tagSaving = await Tags.create({
                            post_id,
                            tag_name: tagname,
                        })
                    }
                }
                return res.status(200).json({
                    message: "Save new post successfully",
                    post_id,
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
            const result = await Posts.fetchPostWithAuthor({ post_id })
            const tags = await Tags.findAll({
                attributes: [`tag_name`],
                where: { post_id },
            })

            return res.status(200).json({
                message: "Get a post successfully",
                post: {
                    ...result[0][0],
                    tags,
                },
                author: result[1][0],
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
            const posts = await Posts.findAll({ where: { author_id } })

            for (const post of posts) {
                const tags = await Tags.findAll({ where: { post_id: post.id } })
                post.tags = tags;
            }

            return res.status(200).json({
                message: "Get all posts successfully",
                posts,
            })
        } catch (err) {
            console.log(err);
            return res.status(500).json({
                message: "Internal Server Error",
                error: err.message,
            })
        }
    }

    //[GET] /api/post/get/tags/:post_id
    async getTags(req, res, next) {
        const post_id = parseInt(req.params.post_id)
        try {
            const tags = await Tags.findAll({ where: { post_id } })

            return res.status(200).json({
                message: "Get post tags successfully",
                tags,
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
            const result = await PostLikes.fetchLikesNumber({ post_id: post_id })
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
        const { liked } = req.body;
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

    //[GET] /api/post/comment/get/:id
    async getComments(req, res, next) {
        const post_id = parseInt(req.params.id)
        try {
            const comments = await PostComments.fetchCommentWithSender({
                post_id,
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

    //[POST] /api/post/comment/save
    async saveNewComment(req, res, next) {
        const { post_id, sender_id, content, parent_comment_id } = req.body;

        try {
            const commentSaving = await PostComments.create({
                post_id, sender_id, content, parent_comment_id,
            })
            const author_id =
                (await Posts.findOne({
                    attributes: [`author_id`],
                    where: { id: post_id },
                }))?.author_id

            const parent_comment_sender_id =
                (!parent_comment_id) ? null
                    : (await PostComments.findOne({
                        attributes: [`sender_id`],
                        where: { id: parent_comment_id },
                    }))?.sender_id;

            const notiSaving =
                (author_id == sender_id &&
                    (!parent_comment_id || parent_comment_sender_id == author_id))
                    ? null
                    : (await Notifications.create({
                        notifiable_id: commentSaving.notifiable_id,
                        type: PostNotificationTypes.POST_COMMENTS,
                    }));

            if (notiSaving) {
                // Add a notification to author.
                if (author_id != sender_id) {
                    await NotificationReceiver.create({
                        notification_id: notiSaving.insertId,
                        receiver_id: author_id,
                    });
                }

                // Add a notification to parent_comment's sender.
                if (parent_comment_id && parent_comment_sender_id != sender_id) {
                    await NotificationReceiver.create({
                        notification_id: notiSaving.insertId,
                        receiver_id: parent_comment_sender_id,
                    });
                }
            }

            const savedComment = await PostComments.findOne({
                attributes: [`created_at`],
                where: { id: commentSaving.insertId }
            })

            return res.status(200).json({
                message: "Success",
                comment: {
                    id: commentSaving.insertId,
                    post_id, sender_id,
                    content, parent_comment_id,
                    created_at: savedComment.created_at,
                }
            })
        } catch (err) {
            console.log(err);
            return res.status(500).json({
                message: "Internal Server Error",
                err: err.message,
            })
        }
    }

    // [GET] api/post/get/featured/authors
    async getFeaturedAuthors(req, res, next) {
        try {
            const authors = await Posts.getFeaturedAuthorsTop3();
            return res.status(200).json({
                message: "Success",
                authors,
            })
        } catch (err) {
            console.log(err);
            return res.status(500).json({
                message: "Internal Server Error",
                err: err.message,
            })
        }
    }

    // [GET] api/post/get/featured/topics
    async getFeaturedTopics(req, res, next) {
        try {
            const tags = await Tags.getFeaturedTopics();
            return res.status(200).json({
                message: "Success",
                tags, 
            })

        } catch (err) {
            console.log(err);
            return res.status(500).json({
                message: "Internal Server Error",
                err: err.message,
            })
        }
    }

    // [GET] api/post/get/featured/posts
    async getHotPosts(req, res, next) {
        try {
            const posts = await Posts.getHotPosts();
            for (const post of posts) {
                const authorData = await Users.findOne({
                    attributes: [`id`, `username`, `avatar_url`],
                    where: { id: post.author_id }
                })

                const tags = await Tags.findAll({
                    where: { post_id: post.id }
                })
                post.author = authorData;
                post.tags = tags;
            }
            return res.status(200).json({
                message: "Success",
                posts,
            })

        } catch (err) {
            console.log(err);
            return res.status(500).json({
                message: "Internal Server Error",
                err: err.message,
            })
        }
    }
}

module.exports = new postController();