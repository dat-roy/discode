const mysql = require('mysql2/promise');
const dbConnection = require("../config/db/index.db");
const { Model } = require('./Model');
const Users = require('./users.model');

class PostComments extends Model {
    constructor(tableName) {
        super(tableName);
    }

    async create(params) {
        let post_id = mysql.escape(params.post_id);
        let sender_id = mysql.escape(params.sender_id);
        let content = mysql.escape(params.content);
        let parent_comment_id = mysql.escape(params.parent_comment_id);

        let sql = `INSERT INTO ${this.tableName}(post_id, sender_id, content, parent_comment_id, created_at) 
        VALUES(${post_id}, ${sender_id}, ${content}, ${parent_comment_id}, NOW())`;
        return await dbConnection.query(sql);
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
        const u = Users.tableName;

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

module.exports = new PostComments("post_comments")