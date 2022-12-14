const mysql = require('mysql2/promise');
const dbConnection = require("../config/db/index.db");
const { Model } = require('./Model');
const { TABLES } = require('./config');

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
        return await dbConnection.query(sql);
    }

    async delete(params) {
        let message_id = mysql.escape(params.message_id);
        let sender_id = mysql.escape(params.sender_id);

        let sql = `DELETE FROM ${this.tableName}\
                WHERE id=${message_id} AND sender_id=${sender_id}`;
        return await dbConnection.query(sql);
    }

    async findOneWithSenderData(params) {
        let msg_id = mysql.escape(params.msg_id);
        const m = this.tableName;
        const u = TABLES.USERS;
        let sql = `SELECT ${m}.id, ${m}.content, ${m}.message_type,\
                        ${m}.parent_message_id, ${m}.created_at, ${m}.deleted_at,\
                        ${m}.sender_id, ${u}.avatar_url, ${u}.username, ${u}.gender, ${u}.email\
                    FROM ${m} INNER JOIN ${u} ON ${m}.sender_id = ${u}.id\
                    WHERE ${m}.id = ${msg_id}`;
        return (await dbConnection.query(sql))[0];
    }

    async fetchLastMessage(params) {
        let user_id = mysql.escape(params.user_id);
        let room_id = mysql.escape(params.room_id);

        const m = this.tableName;
        const mr = TABLES.MESSAGE_RECIPIENTS;
        const ur = TABLES.USER_ROOM;

        let sql = `SELECT * FROM ${m}\
                INNER JOIN ${mr}\
                    ON ${mr}.message_id = ${m}.id\
                INNER JOIN ${ur}\
                    ON ${ur}.id = ${mr}.recipient_room_id\
                WHERE ${ur}.user_id = ${user_id} AND ${ur}.room_id = ${room_id}\
                ORDER BY ${m}.created_at DESC LIMIT 1`;
        return await dbConnection.query(sql);
    }

    async fetchUnreadMessages(params) {
        let user_id = mysql.escape(params.user_id);
        let room_id = mysql.escape(params.room_id);

        const m = this.tableName;
        const mr = TABLES.MESSAGE_RECIPIENTS;
        const ur = TABLES.USER_ROOM;

        let sql = `SELECT * FROM ${m}\
                INNER JOIN ${mr}\
                    ON ${mr}.message_id = ${m}.id\
                INNER JOIN ${ur}\
                    ON ${ur}.id = ${mr}.recipient_room_id\
                WHERE ${m}.sender_id != ${user_id} AND ${ur}.user_id = ${user_id} 
                    AND ${ur}.room_id = ${room_id} AND ${mr}.is_read = false\
                ORDER BY ${m}.created_at DESC`;
        return await dbConnection.query(sql);
    }
}

module.exports = new Messages(TABLES.MESSAGES)