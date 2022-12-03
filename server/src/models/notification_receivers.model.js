const mysql = require('mysql2/promise');
const dbConnection = require("../config/db/index.db");
const { Model } = require('./Model');
const UserChannel = require('./user_channel.model')
const Notifications = require('./notifications.model');
const Notifiable = require('./notifiable.model');

class NotificationReceivers extends Model {
    constructor(tablename) {
        super(tablename);
    }

    async create(params) {
        let notification_id = mysql.escape(params.notification_id);
        let receiver_id = mysql.escape(params.receiver_id);
        const sql = `INSERT INTO ${this.tableName} (notification_id, receiver_id, status, created_at)\
                VALUES(${notification_id}, ${receiver_id}, 0, created_at)`;
        return await dbConnection.query(sql);
    }

    async checkNotiExistence(params) {
        let receiver_id = mysql.escape(params.receiver_id);
        let source_type = mysql.escape(params.source_type);
        
        const noti_r = this.tableName
        const noti = Notifications.tableName;
        const noti_i = Notifiable.tableName;
        const sql = `SELECT count(*) AS number FROM ${noti_r}\
                    INNER JOIN ${noti} ON ${noti_r}.notification_id = ${noti}.id\
                    WHERE receiver_id=${receiver_id} AND (\
                        SELECT ${noti_i}.source_type FROM ${noti_i}\
                        WHERE ${noti_i}.id = ${noti}.notifiable_id\ 
                    ) = ${source_type}`;
        return await dbConnection.query(sql);
    }

    async checkChannelNotiSent(params) {
        const sender_id = mysql.escape(params.sender_id);
        const receiver_id = mysql.escape(params.receiver_id);
        const channel_id = mysql.escape(params.channel_id);
        const noti_type = mysql.escape(params.noti_type);

        const uc = UserChannel.tableName;
        const noti = Notifications.tableName;
        const noti_r = this.tableName;
        const sql = `SELECT EXISTS (\
                        SELECT ${noti_r}.receiver_id FROM ${noti_r}\
                        WHERE receiver_id = ${receiver_id}\
                            AND (\
                                SELECT COUNT(*) FROM ${uc}\
                                WHERE (\
                                    SELECT notifiable_id FROM ${noti}\
                                    WHERE ${noti}.id = ${noti_r}.notification_id\
                                        AND ${noti}.type = ${noti_type}\
                                ) = ${uc}.notifiable_id AND user_id = ${sender_id}\
                                    AND channel_id = ${channel_id}\
                            ) > 0\
                    ) AS existence`;

        return (await dbConnection.query(sql))[0].existence;
    }
}

module.exports = new NotificationReceivers("notification_receivers")
