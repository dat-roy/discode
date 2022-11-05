const mysql = require('mysql2/promise');
const dbConnection = require("../config/db/index.db");
const { Model } = require('./Model');

class MessageRecipients extends Model {
    constructor(tableName) {
        super(tableName);
    }

    async create(params) {
        let recipient_id = mysql.escape(params.recipient_id);
        let recipient_room_id = mysql.escape(params.recipient_room_id);
        let message_id = mysql.escape(params.message_id);

        let sql = `INSERT INTO ${this.tableName}(recipient_id, recipient_room_id, message_id)\
                VALUES(${recipient_id}, ${recipient_room_id}, ${message_id})`;
        console.log(sql);
        return await dbConnection.query(sql);
    }
}

module.exports = new MessageRecipients("message_recipients")