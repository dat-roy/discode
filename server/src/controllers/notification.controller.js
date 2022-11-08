const NotifyReceiver = require('../models/notification_receiver.model');
const NotifyObject = require('../models/notification_object.model');
const PostLikes = require('../models/post_likes.model');
const PostComments = require('../models/post_comments.model');
const InviteChannel = require('../models/channels.model');
const Posts = require('../models/posts.model');
const Users = require('../models/users.model');
const notification_receiverModel = require('../models/notification_receiver.model');

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
                    
                    if (createNotify.affectedRows !== 0) {
                        const notifyID = createNotify.insertId;
                        
                        // create notify in author_id
                        const createNotifyAuthor = await notification_receiverModel.createNotificationReceiver({
                            notification_object_id: notifyID,
                            receiver_id: author_id,
                        })
                        
                        return res.status(200).json({
                            message: "Send notification successfully",
                        })
                    }
                } else {
                    return res.status(404).json({
                        message: "AffectedRows == 0",
                    })
                }
            }
            
        } catch (error) {
            console.log(error.message);
            return res.status(500).json({
                message: "An internal error from server"
            });
        }
    }

    async createPostCommentNotify(req, res, next) {
        let {author_id, post_id, sender_id, content, parent_comment_id} = req.body;
        
        try {
            const checkPostIdExists = await Posts.checkExistence({where: {id: post_id}});
            const checkSenderIdExists = await Users.checkExistence({where: {id: sender_id}});
            const checkParentCmtIDExists = await PostComments.checkExistence({where: {id: parent_comment_id}});
            if (!checkPostIdExists) {
                return res.status(404).json({
                    message: "Can not detect postID"
                })
            } else if (!checkSenderIdExists) {
                return res.status(404).json({
                    message: "Can not detect userID"
                })
            } else {
                // Check parent_comment_id is valid or not
                if (!checkParentCmtIDExists) {
                    parent_comment_id = null;
                }
                // Insert data in database
                const insertCommentInPost = PostComments.create({
                    post_id: post_id,
                    sender_id: sender_id,
                    content: content,
                    parent_comment_id: parent_comment_id,
                })
                console.log(insertCommentInPost);
                // check insert data successfully 
                if (insertCommentInPost.affectedRows !== 0) {
                    const entity_id = insertCommentInPost.insertId;
                    
                    const createNotify = await NotifyObject.createNotification({
                        notification_type: 'comment',
                        entity_id: entity_id,
                    })
                    // check insert data in dtb successfully 
                    if (createNotify.affectedRows !== 0) {
                        const notifyID = createNotify.insertId;
                        
                        // create notify in author_id
                        const createNotifyAuthor = await notification_receiverModel.createNotificationReceiver({
                            notification_object_id: notifyID,
                            receiver_id: author_id,
                        })
                        
                        // check parent_comment_id is not null and diffrent author_id
                        if (parent_comment_id !== author_id && checkParentCmtIDExists) {
                            //create notify in parent_comment_id
                            const createNotifyReceiver = await notification_receiverModel.createNotificationReceiver({
                                notification_object_id: notifyID,
                                receiver_id: parent_comment_id,
                            })
                        }

                        return res.status(200).json({
                            message: "Send notification successfully",
                        })
                    }
                } else {
                    return res.status(404).json({
                        message: "AffectedRows == 0",
                    })
                }
            }

        } catch (error) {
            console.log(error.message);
            return res.status(500).json({
                message: "An internal error from server"
            });
        }
    }

}

module.exports = new notificationController();
