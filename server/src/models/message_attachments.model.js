const mysql = require('mysql2/promise');
const dbConnection = require("../config/db/index.db");
const { Model } = require('./Model');

class MessageAttachments extends Model {
    constructor(tableName) {
        super(tableName);
    }

    async create(params) {
        let message_id = mysql.escape(params.message_id);
        let attachment_content = mysql.escape(params.attachment_content);

        let sql = `INSERT INTO ${this.tableName}(message_id, attachment_content)\
                VALUES(${message_id}, ${attachment_content})`;
        return await dbConnection.query(sql);
    }
}

module.exports = new MessageAttachments("message_attachments")