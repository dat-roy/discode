const Users = require('../models/users.model')
const UserChannel = require('../models/user_channel.model')
const NotificationReceivers = require('../models/notification_receivers.model');
const { ChannelNotificationTypes } = require('../types/db.type');

class searchController {
    //[GET] /api/search/user/:param
    async searchUser(req, res, next) {
        const { param } = req.params;
        if (param === '') {
            return res.status(200).json({
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
            return res.status(200).json({
                message: "Empty query value",
            })
        }
        try {
            const users = await Users.findAll({
                attributes: [
                    "id", "username", "email",
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
}

module.exports = new searchController();