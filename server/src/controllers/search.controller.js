const Users = require('../models/users.model');
const UserChannel = require('../models/user_channel.model');
const Channels = require('../models/channels.model');
const NotificationReceivers = require('../models/notification_receivers.model');
const { ChannelNotificationTypes } = require('../types/db.type');
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
                const invitationExists = await NotificationReceivers.checkChannelNotiSent({
                    sender_id,
                    receiver_id: user.id,
                    channel_id,
                    noti_type: ChannelNotificationTypes.CHANNEL_INVITE,
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
}

module.exports = new searchController();