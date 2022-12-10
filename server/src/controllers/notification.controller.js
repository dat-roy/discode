const NotificationReceivers = require('../models/notification_receivers.model');
const Notifications = require('../models/notifications.model');
const PostLikes = require('../models/post_likes.model');
const PostComments = require('../models/post_comments.model');
const Channels = require('../models/channels.model');
const ChannelRequests = require('../models/channel_requests.model');
const Posts = require('../models/posts.model');
const Users = require('../models/users.model');
const UserChannels = require('../models/user_channel.model')

class notificationController {
    async createPostLikeNotify(req, res, next) {
        const { post_id, user_id, author_id } = req.body;

        try {
            const checkPostIdExists = await Posts.checkExistence({ where: { id: post_id } });
            const checkUserIdExists = await Users.checkExistence({ where: { id: user_id } });
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
                const result = await PostLikes.create({
                    post_id: post_id,
                    user_id: user_id
                })

                if (result.affectedRows !== 0) {
                    const entity_id = result.insertId;

                    const createNotify = await Notifications.createNotification({
                        notification_type: 'like',
                        entity_id: entity_id,
                    })

                    if (createNotify.affectedRows !== 0) {
                        const notifyID = createNotify.insertId;

                        // create notify in author_id
                        const createNotifyAuthor = await NotificationReceivers.createNotificationReceiver({
                            notification_object_id: notifyID,
                            receiver_id: author_id,
                        })

                        return res.status(200).json({
                            message: "Send notification successfully",
                        })
                    }
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
        let { author_id, post_id, sender_id, content, parent_comment_id } = req.body;

        try {
            const checkPostIdExists = await Posts.checkExistence({ where: { id: post_id } });
            const checkSenderIdExists = await Users.checkExistence({ where: { id: sender_id } });
            const checkParentCmtIDExists = await PostComments.checkExistence({ where: { id: parent_comment_id } });
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
                const insertCommentInPost = await PostComments.create({
                    post_id: post_id,
                    sender_id: sender_id,
                    content: content,
                    parent_comment_id: parent_comment_id,
                })
                console.log(insertCommentInPost);
                // check insert data successfully 
                if (insertCommentInPost.affectedRows !== 0) {
                    const entity_id = insertCommentInPost.insertId;

                    const createNotify = await Notifications.createNotification({
                        notification_type: 'comment',
                        entity_id: entity_id,
                    })
                    // check insert data in dtb successfully 
                    if (createNotify.affectedRows !== 0) {
                        const notifyID = createNotify.insertId;

                        // create notify in author_id
                        const createNotifyAuthor = await NotificationReceivers.createNotificationReceiver({
                            notification_object_id: notifyID,
                            receiver_id: author_id,
                        })

                        // check parent_comment_id is not null and diffrent author_id
                        if (parent_comment_id !== author_id && checkParentCmtIDExists) {
                            //create notify in parent_comment_id
                            const createNotifyReceiver = await NotificationReceivers.createNotificationReceiver({
                                notification_object_id: notifyID,
                                receiver_id: parent_comment_id,
                            })
                        }

                        return res.status(200).json({
                            message: "Send notification successfully",
                        })
                    }
                }
            }

        } catch (error) {
            console.log(error.message);
            return res.status(500).json({
                message: "An internal error from server"
            });
        }
    }

    async createInviteUserNotify(req, res, next) {
        const { userInvite_id, channel_id, admin_id } = req.body;

        try {
            const checkUserInviteIDExists = await Users.checkExistence({ where: { id: userInvite_id } });

            //check channel_id and admin_id 
            const checkValidChannelInvite = await Channels.checkExistence({
                where:
                    `id = ${channel_id} AND admin_id = ${admin_id}`
            })
            if (!checkUserInviteIDExists) {
                return res.status(404).json({
                    message: "Invite User not exists"
                })
            } else if (!checkValidChannelInvite) {
                return res.status(404).json({
                    message: "Invalid channel_id"
                })
            } else {
                const checkAlreadyInvite = await Notifications.checkExistence({
                    where:
                        `entity_id = ${channel_id} AND notification_type = 'invite'`
                })

                if (checkAlreadyInvite) {
                    return res.status(404).json({
                        message: "Already Invite"
                    })
                } else {
                    const createNotifyInvite = await Notifications.createNotification({
                        notification_type: 'invite',
                        entity_id: channel_id,
                    })

                    if (createNotifyInvite.affectedRows !== 0) {
                        const notifyID = createNotifyInvite.insertId;

                        // create notify in userInvite_Id
                        const createInviteUserNotify = await NotificationReceivers.createNotificationReceiver({
                            notification_object_id: notifyID,
                            receiver_id: userInvite_id,
                        })
                        return res.status(200).json({
                            message: "Send notification successfully",
                        })
                    }
                }
            }
        } catch (error) {
            console.log(error.message);
            return res.status(500).json({
                message: "An internal error from server"
            });
        }
    }

    //[POST] /api/notification/get/global
    async getGlobalNotis(req, res, next) {
        const { user_id, source_type, offset } = req.body;
        try {
            if (source_type === 'post') {
                const notis = await NotificationReceivers.getPostNotis({
                    receiver_id: user_id,
                    offset,
                })
                for (const noti of notis) {
                    const thisComment = await PostComments.findOne({
                        attributes: [`post_id`, `sender_id`, `parent_comment_id`],
                        where: { id: noti.post_comments_id }
                    })
                    const thisSender = await Users.findOne({
                        attributes: [`id`, `username`, `email`, `avatar_url`],
                        where: { id: thisComment.sender_id }
                    })

                    const is_reply =
                        (!thisComment.parent_comment_id)
                            ? false
                            : (await PostComments.findOne({
                                attributes: [`sender_id`],
                                where: { id: thisComment.parent_comment_id }
                            }))?.sender_id === user_id
                                ? true
                                : false;
                    noti.comment_data = thisComment;
                    noti.sender_data = thisSender;
                    noti.is_reply = is_reply;
                }
                return res.status(200).json({
                    message: "Success",
                    notis,
                })
            } else if (source_type === 'channel') {
                const notis = await NotificationReceivers.getChannelNotis({
                    receiver_id: user_id,
                    offset,
                })
                for (const noti of notis) {
                    const userChannel = await UserChannels.findOne({ where: { id: noti.user_channel_id } })
                    const thisChannel = await Channels.findOne({
                        where: { id: userChannel.channel_id }
                    })
                    const thisSender = await Users.findOne({
                        attributes: [`id`, `username`, `avatar_url`],
                        where: { id: userChannel.user_id }
                    })
                    noti.channel_data = thisChannel;
                    noti.sender_data = thisSender;
                }
                return res.status(200).json({
                    message: "Success",
                    notis,
                })
            } else {
                return res.status(400).json({
                    message: "Invalid source type",
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

    //[POST] /api/notification/get/channel/requests
    async getChannelRequests(req, res, next) {
        const { admin_id, channel_id, offset } = req.body;
        try {
            const notis = await NotificationReceivers.getChannelRequests({
                admin_id, channel_id, offset,
            })
            for (const noti of notis) {
                const sender_id =
                    (await ChannelRequests.findOne({
                        attributes: [`user_id`],
                        where:
                            `notifiable_id=${noti.notifiable_id} AND channel_id=${channel_id}`,
                    })).user_id;
                
                const sender = await Users.findOne({
                    attributes: [`id`, `username`, `email`, `avatar_url`], 
                    where: {
                        id: sender_id, 
                    }
                })
                noti.sender = sender;
            }

            return res.status(200).json({
                message: "Success",
                notis,
            })
        } catch (err) {
            console.log(err);
            return res.status(500).json({
                message: "Internal Server Error",
                error: err.message,
            })
        }
    }

    //[POST] /api/notification/read/one
    async markOneAsRead(req, res, next) {
        const { user_id, noti_id } = req.body;
        try {
            const result = await NotificationReceivers.markOneAsRead({
                user_id, noti_id,
            })
            return res.status(200).json({
                message: "Success",
                result,
            })
        } catch (err) {
            console.log(err);
            res.status(500).json({
                message: "Internal Server Error",
                error: err.message,
            })
        }
    }

    //[POST] /api/notification/read/all
    async markAllAsRead(req, res, next) {
        const { user_id, source_type, types } = req.body;
        try {
            const result = await NotificationReceivers.markAllAsRead({
                user_id, source_type, types
            })
            return res.status(200).json({
                message: "Success",
                result,
            })
        } catch (err) {
            console.log(err);
            res.status(500).json({
                message: "Internal Server Error",
                error: err.message,
            })
        }
    }
}

module.exports = new notificationController();
