const NotifyReceiver = require('../models/notification_receiver.model');
const NotifyObject = require('../models/notification_object.model');
const PostLikes = require('../models/post_likes.model');
const PostComments = require('../models/post_comments.model');
const InviteChannel = require('../models/channels.model');
const Posts = require('../models/posts.model');
const Users = require('../models/users.model');

class notificationController {
    async createPostLikeNotify(req, res, next) {
        const {post_id, user_id} = req.body;

        try {
            const checkPostIdExists = await Posts.checkExistence({where: {id: post_id}});
            const checkUserIdExists = await Users.checkExistence({where: {id: user_id}});
            const checkLikeAlreadyExists = await PostLikes.checkExistence({
                where:
                    `post_id = ${post_id} AND user_id = ${user_id}`,
            })
            if (!checkPostIdExists) {
                return res.status(404).json({
                    message: "Can not detect postID"
                })
            } else if (!checkUserIdExists) {
                return res.status(404).json({
                    message: "Can not detect userID"
                })
            } else if (checkLikeAlreadyExists) {
                return res.status(404).json({
                    message: "Like Post already in database "
                })
            } else {
                const result = PostLikes.create({
                    post_id: post_id,
                    user_id: user_id
                })

                if (result.affectedRows !== 0) {
                    const entity_id = result.insertId;
                    
                    const createNotify = await NotifyObject.createNotification({
                        notification_type: 'like',
                        entity_id: entity_id,
                    })

                    return res.status(200).json({
                        message: "Create Like notification successfully",
                        result: createNotify
                    })
                }
            }
            
        } catch (error) {
            console.log(err.message);
            return res.status(500).json({
                message: "An internal error from server"
            })
        }
    }
    async getNotification(req, res, next) {
        const {post_id, sender_id, content, parent_comment_id, notification_type} = req.body;

    }
}

module.exports = new notificationController();
