const mysql = require('mysql2/promise');
const dbConnection = require("../config/db/index.db");
const { Model } = require('./Model');
const MessageRecipients = require('./message_recipients.model')
const UserRoom = require('./user_room.model')

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
        //console.log(sql);
        return await dbConnection.query(sql);
    }

    async delete(params) {
        let message_id = mysql.escape(params.message_id);
        let sender_id = mysql.escape(params.sender_id);

        let sql = `DELETE FROM ${this.tableName}\
                WHERE id=${message_id} AND sender_id=${sender_id}`;
        //console.log(sql);
        return await dbConnection.query(sql);
    }

    async fetchLastMessage(params) {
        let user_id = mysql.escape(params.user_id);
        let room_id = mysql.escape(params.room_id);

        const m = this.tableName;
        const mr = MessageRecipients.tableName;
        const ur = UserRoom.tableName;

        let sql = `SELECT * FROM ${m}\
                INNER JOIN ${mr}\
                    ON ${mr}.message_id = ${m}.id\
                INNER JOIN ${ur}\
                    ON ${ur}.id = ${mr}.recipient_room_id\
                WHERE ${ur}.user_id = ${user_id} AND ${ur}.room_id = ${room_id}\
                ORDER BY ${m}.created_at DESC LIMIT 1`;
        //console.log(sql);
        return await dbConnection.query(sql);
    }

    async fetchUnreadMessages(params) {
        let user_id = mysql.escape(params.user_id);
        let room_id = mysql.escape(params.room_id);

        const m = this.tableName;
        const mr = MessageRecipients.tableName;
        const ur = UserRoom.tableName;

        let sql = `SELECT * FROM ${m}\
                INNER JOIN ${mr}\
                    ON ${mr}.message_id = ${m}.id\
                INNER JOIN ${ur}\
                    ON ${ur}.id = ${mr}.recipient_room_id\
                WHERE ${m}.sender_id != ${user_id} AND ${ur}.user_id = ${user_id} 
                    AND ${ur}.room_id = ${room_id} AND ${mr}.is_read = false\
                ORDER BY ${m}.created_at DESC`;

        //console.log(sql);
        return await dbConnection.query(sql);
    }
}

module.exports = new Messages("messages")