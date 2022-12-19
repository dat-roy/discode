const mysql = require('mysql2/promise');
const dbConnection = require("../config/db/index.db");
const { TABLES } = require('./config');
const { Model } = require('./Model');

class PostComments extends Model {
    constructor(tableName) {
        super(tableName);
    }

    async create(params) {
        let post_id = mysql.escape(params.post_id);
        let sender_id = mysql.escape(params.sender_id);
        let content = mysql.escape(params.content);
        let parent_comment_id = mysql.escape(params.parent_comment_id);
        if (!parent_comment_id) parent_comment_id = 0;

        /* ---Without notifiable (deprecated)--- */
        // const sql = `INSERT INTO ${this.tableName}(post_id, sender_id, content, parent_comment_id, created_at) 
        // VALUES(${post_id}, ${sender_id}, ${content}, ${parent_comment_id}, NOW())`;

        /* See user_channel model */
        const sql = `CALL insert_notifiable_post_comments(\
                    ${post_id}, ${sender_id}, ${content}, ${parent_comment_id}, @post_comment_id, @notifiable_id\
                )`;

        const result = (await dbConnection.query(sql))[0][0];
        return {
            insertId: result['@post_comment_id'],
            notifiable_id: result['@notifiable_id'],
        }
    }

    async delete(params) {
        let id = mysql.escape(params.id);
        let post_id = mysql.escape(params.user_id);
        let user_id = mysql.escape(params.post_id);

        let sql = ``;
        return await dbConnection.query(sql);
    }

    async fetchCommentWithSender(params) {
        let post_id = mysql.escape(params.post_id);

        const pc = this.tableName;
        const u = TABLES.USERS;

        let sql = `SELECT
                    ${pc}.id, ${pc}.post_id, ${pc}.sender_id, 
                    ${pc}.content, ${pc}.parent_comment_id, ${pc}.created_at, 
                    ${u}.username, ${u}.avatar_url, ${u}.email
                FROM ${pc}\
                INNER JOIN ${u} ON ${u}.id = ${pc}.sender_id\
                WHERE ${pc}.post_id = ${post_id}`;
        return await dbConnection.query(sql);
    }
}

module.exports = new PostComments(TABLES.POST_COMMENTS)