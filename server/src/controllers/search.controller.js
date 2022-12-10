const Users = require('../models/users.model');
const UserChannel = require('../models/user_channel.model');
const Channels = require('../models/channels.model');
const Posts = require('../models/posts.model');
const PostLikes = require('../models/post_likes.model');
const PostComments = require("../models/post_comments.model");
const Tags = require('../models/tags.model');
const NotificationReceivers = require('../models/notification_receivers.model');
const { formatMediaURL } = require('../utils/formatters/url-formatter');

class searchController {
    //[GET] /api/search/user/:param
    async searchUser(req, res, next) {
        const { param } = req.params;
        if (param === '') {
            return res.status(400).json({
                message: "Empty query value",
            })
        }
        try {
            const results = await Users.findAll({
                attributes: [
                    "id", "username", "email",
                ],
                where:
                    `username LIKE '%${param}%' `
                    + `OR SUBSTRING(email FROM 1 FOR LOCATE('@', email)) LIKE '%${param}%'`,
                // `MATCH(username, email)  AGAINST ('${param}' IN NATURAL LANGUAGE MODE)`
            })
            return res.status(200).json({
                results,
            })
        } catch (err) {
            console.log(err);
            return res.status(500).json({
                message: "Internal Server Error",
            })
        }
    }

    //[POST] /api/search/user/channel/not-in
    //With invitation status.
    async searchUserNotInChannel(req, res, next) {
        const { sender_id, channel_id, text } = req.body;
        if (!text) {
            return res.status(400).json({
                message: "Empty query value",
            })
        }
        try {
            const users = await Users.findAll({
                attributes: [
                    "id", "username", "email", "avatar_url",
                ],
                where:
                    `username LIKE '%${text}%' `
                    + `OR SUBSTRING(email FROM 1 FOR LOCATE('@', email)) LIKE '%${text}%'`,
                // `MATCH(username, email)  AGAINST ('${param}' IN NATURAL LANGUAGE MODE)`
            })

            const userListStr = (users.map(user => user.id)).join(', ');
            const members = await UserChannel.findAll({
                attributes: [`user_id`],
                where:
                    `channel_id=${channel_id} `
                    + ((userListStr) ? `AND user_id IN (${userListStr})` : ''),
            })
            const notInChannel = users.filter(user => !members.some(mem => mem.user_id == user.id));
            for (const user of notInChannel) {
                const invitationExists = await NotificationReceivers.checkChannelInvitationSent({
                    sender_id,
                    receiver_id: user.id,
                    channel_id,
                })
                user.invited = invitationExists;
            }
            return res.status(200).json({
                results: notInChannel,
            })
        } catch (err) {
            console.log(err);
            return res.status(500).json({
                message: "An internal error from server"
            })
        }
    }

    //[GET] /api/search/channel/:text 
    async searchChannelByName(req, res, next) {
        const { text } = req.params;
        if (!text) {
            return res.status(400).json({
                message: "Empty query value",
            })
        }
        try {
            const channels = await Channels.findAll({
                where:
                    `title LIKE '%${text}%' OR description LIKE '%${text}%'`,
            })

            for (const channel of channels) {
                channel.avatar_url = formatMediaURL(channel.avatar_url);
                channel.background_url = formatMediaURL(channel.background_url);
                const membersNumber = await UserChannel.countMembersNumber({
                    channel_id: channel.id,
                })
                channel.members_number = membersNumber;
            }

            return res.status(200).json({
                message: "Success",
                channels,
            })
        } catch (err) {
            console.log(err);
            return res.status(500).json({
                message: "Internal Server Error",
                error: err.message,
            })
        }
    }

    //[GET] /api/search/post/:text
    async searchPostByTitle(req, res, next) {
        const { text } = req.params;
        if (!text) {
            return res.status(400).json({
                message: "Empty query value",
            })
        }
        try {
            const posts = await Posts.findAll({
                where:
                    `title LIKE '%${text}%'`,
            })
            for (const post of posts) {
                const authorData = await Users.findOne({
                    attributes: [`id`, `username`, `avatar_url`],
                    where: { id: post.author_id }
                })
                const likes =
                    (await PostLikes.fetchLikesNumber({ post_id: post.id }))?.number;
                const comments =
                    (await PostComments.findOne({
                        attributes: [`COUNT(*) AS number`],
                        where: {
                            post_id: post.id,
                        }
                    }))?.number;
                const tags = await Tags.findAll({ where: { post_id: post.id } })
                post.author = authorData;
                post.likes = likes;
                post.comments = comments;
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
                error: err.message,
            })
        }
    }
}

module.exports = new searchController();