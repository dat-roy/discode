const mysql = require('mysql2/promise');
const dbConnection = require("../config/db/index.db");
const { Model } = require('./Model');

class Messages extends Model {
    constructor(tableName) {
        super(tableName);
    }

    async create(params) {
        let sender_id = mysql.escape(params.sender_id);
        let content = mysql.escape(params.content);
        let message_type = mysql.escape(params.message_type);
        let parent_message_id = mysql.escape(params.parent_message_id);

        let sql = `INSERT INTO ${this.tableName}(sender_id, content, message_type,\ 
                    parent_message_id, created_at)\
                VALUES(${sender_id}, ${content}, ${message_type}, ${parent_message_id}, NOW())`;
        console.log(sql);
        return await dbConnection.query(sql);
    }

    async delete(params) {
        let message_id = mysql.escape(params.message_id);
        let sender_id = mysql.escape(params.sender_id);

        let sql = `DELETE FROM ${this.tableName}\
                WHERE id=${message_id} AND sender_id=${sender_id}`;
        console.log(sql);
        return await dbConnection.query(sql);
    }
}

module.exports = new Messages("messages")