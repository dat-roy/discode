const mysql = require('mysql2/promise');
const dbConnection = require("../config/db/index.db");
const { Model } = require('./Model');
const { TABLES } = require('./config');

class MessageRecipients extends Model {
    constructor(tableName) {
        super(tableName);
    }

    async create(params) {
        let recipient_id = mysql.escape(params.recipient_id);
        let recipient_room_id = mysql.escape(params.recipient_room_id);
        let message_id = mysql.escape(params.message_id);
        let is_read = mysql.escape(params.is_read);

        let sql = `INSERT INTO ${this.tableName}(recipient_id, recipient_room_id, message_id, is_read)\
                VALUES(${recipient_id}, ${recipient_room_id}, ${message_id}, ${is_read})`;
        return await dbConnection.query(sql);
    }

    async markAsReadForAll(params) {
        let recipient_id = mysql.escape(params.recipient_id);
        let recipient_room_id = mysql.escape(params.recipient_room_id);

        let sql = `UPDATE ${this.tableName} SET is_read=1\
                WHERE recipient_id=${recipient_id} AND recipient_room_id=${recipient_room_id}\
                    AND is_read=0`;
        return await dbConnection.query(sql);
    }

    async countUnread(params) {
        let recipient_room_id = mysql.escape(params.recipient_room_id);

        let sql = `SELECT COUNT(id) AS count FROM ${this.tableName}\
            WHERE recipient_room_id=${recipient_room_id} AND is_read=0`;
        return (await dbConnection.query(sql))[0].count;
    }
}

module.exports = new MessageRecipients(TABLES.MESSAGE_RECIPIENTS)