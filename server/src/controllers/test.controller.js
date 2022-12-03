const Notifications = require('../models/notifications.model');
const NotificationReceivers = require('../models/notification_receivers.model');

class testController {
    //[GET] /api/test/get 
    //Used for testing purpose only.
    async testGet(req, res, next) {
        return res.json({
            datetime: require('moment')().format('YYYY-MM-DD HH:mm:ss')
        })
    }
    //[POST] /api/test/post
    //Used for testing purpose only.
    async testPost(req, res, next) {
        const {a, b, c, d} = req.body;
        const aaa = await NotificationReceivers.checkChannelNotiSent({
            sender_id: a, 
            receiver_id: b, 
            channel_id: c, 
            noti_type: d, 
        })
        return res.json({
            aaa, 
        })
    }
}

module.exports = new testController();