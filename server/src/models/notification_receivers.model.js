const mysql = require('mysql2/promise');
const dbConnection = require("../config/db/index.db");
const { Model } = require('./Model');
const UserChannel = require('./user_channel.model')
const Notifications = require('./notifications.model');
const Notifiable = require('./notifiable.model');
const PostComments = require('./post_comments.model')
const { ChannelNotificationTypes } = require('../types/db.type');

class NotificationReceivers extends Model {
    constructor(tablename) {
        super(tablename);
    }

    async create(params) {
        let notification_id = mysql.escape(params.notification_id);
        let receiver_id = mysql.escape(params.receiver_id);
        const sql = `INSERT INTO ${this.tableName} (notification_id, receiver_id, status, created_at)\
                VALUES(${notification_id}, ${receiver_id}, 0, NOW())`;
        return await dbConnection.query(sql);
    }

    async markOneAsRead(params) {
        let user_id = mysql.escape(params.user_id);
        let noti_id = mysql.escape(params.noti_id);
        const sql = `UPDATE ${this.tableName}\
                    SET status=1 WHERE receiver_id=${user_id} AND notification_id=${noti_id}`
        return await dbConnection.query(sql);
    }

    async markAllAsRead(params) {
        let user_id = mysql.escape(params.user_id);
        let source_type = mysql.escape(params.source_type);
        let types = params.types;

        const typeStr = types?.join(', ');

        const noti_r = this.tableName;
        const noti = Notifications.tableName;
        const noti_i = Notifiable.tableName;
        const sql = `UPDATE ${noti_r}\
                    INNER JOIN ${noti} ON ${noti}.id = ${noti_r}.notification_id\
                    SET ${noti_r}.status=1\
                    WHERE receiver_id=${user_id} AND status=0 `
            + ((types) ? `AND ${noti}.type IN (${typeStr}) ` : ``)
            + `AND (\
                            SELECT source_type FROM ${noti_i}\
                            WHERE ${noti_i}.id = ${noti}.notifiable_id\
                        ) = ${source_type}`;
        return await dbConnection.query(sql);
    }

    async getPostNotis(params) {
        const receiver_id = mysql.escape(parseInt(params.receiver_id));
        const offset = mysql.escape(parseInt(params.offset));

        const noti_r = this.tableName;
        const noti_i = Notifiable.tableName;
        const noti = Notifications.tableName;
        const pc = PostComments.tableName;

        
        const offset_str = ((isNaN(offset)) ? `` : `AND ${noti_r}.id < ${offset} `);

        const sql = `SELECT ${noti_r}.id, ${noti_r}.receiver_id, ${noti_r}.status, ${noti_r}.created_at,\
                        ${noti}.notifiable_id, ${noti}.type as noti_type, ${noti_i}.source_type,\
                        (SELECT id from ${pc} WHERE ${pc}.notifiable_id = ${noti_i}.id) AS post_comments_id\
                    FROM ${noti_r}\
                    INNER JOIN ${noti} ON ${noti}.id = ${noti_r}.notification_id\
                    INNER JOIN ${noti_i} ON ${noti}.notifiable_id = ${noti_i}.id\
                    WHERE ${noti_r}.receiver_id = ${receiver_id}\
                        AND ${noti_i}.source_type = 'post' `
                        + offset_str + 
                        `ORDER BY ${noti_r}.id LIMIT 10`;
        return await dbConnection.query(sql);
    }

    async getChannelNotis(params) {
        const receiver_id = mysql.escape(parseInt(params.receiver_id));
        const offset = mysql.escape(parseInt(params.offset));

        const noti_r = this.tableName;
        const noti_i = Notifiable.tableName;
        const noti = Notifications.tableName;
        const uc = UserChannel.tableName;

        const offset_str = ((isNaN(offset)) ? `` : `AND ${noti_r}.id < ${offset} `);

        const sql = `SELECT ${noti_r}.id, ${noti_r}.receiver_id, ${noti_r}.status, ${noti_r}.created_at,\
                        ${noti}.notifiable_id, ${noti}.type as noti_type, ${noti_i}.source_type,\
                        (SELECT id from ${uc} WHERE ${uc}.notifiable_id = ${noti_i}.id) AS user_channel_id\
                    FROM ${noti_r}\
                    INNER JOIN ${noti} ON ${noti}.id = ${noti_r}.notification_id\
                    INNER JOIN ${noti_i} ON ${noti}.notifiable_id = ${noti_i}.id\
                    WHERE ${noti_r}.receiver_id = ${receiver_id}\
                        AND ${noti_i}.source_type = 'channel'\
                        AND ${noti}.type IN (${ChannelNotificationTypes.CHANNEL_INVITE}, ${ChannelNotificationTypes.CHANNEL_DECLINED}) `
                        + offset_str + 
                        `ORDER BY ${noti_r}.id LIMIT 10`;
        return await dbConnection.query(sql);
    }

    async getChannelRequests(params) {
        const admin_id = mysql.escape(params.admin_id);
        const channel_id = mysql.escape(params.channel_id);
        const offset = mysql.escape(params.offset);

        const noti_r = this.tableName;
        const noti_i = NotificationReceivers.tableName;
        const noti = Notifications.tableName;
        const uc = UserChannel.tableName;

        const sql = `SELECT * FROM ${noti_r}\
                INNER JOIN ${noti} ON ${noti}.id = ${noti_r}.notification_id\
                INNER JOIN ${noti_i} ON ${noti}.notifiable_id = ${noti_i}.id\
                WHERE ${noti_r}.receiver_id = ${admin_id}\
                    AND ${noti}.type = ${ChannelNotificationTypes.CHANNEL_REQUEST}\
                    AND ${noti_i}.source_type = 'channel' ` + 
                    ((offset) ? `AND ${noti_r}.id < ${offset} ` : ``) +
                    `AND (\
                        SELECT channel_id FROM ${uc}\
                        WHERE ${uc}.user_id = ${admin_id} AND ${uc}.notifiable_id = ${noti_i}.id\
                    ) = ${channel_id}\
                    ORDER BY ${noti_r}.id LIMIT 10`;
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
