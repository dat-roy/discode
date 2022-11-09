const mysql = require('mysql2/promise');
const dbConnection = require("../config/db/index.db");
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

        let sql = `INSERT INTO ${this.tableName}(post_id, sender_id, content, parent_comment_id) 
        VALUES(${post_id}, ${sender_id}, ${content}, ${parent_comment_id})`;
        console.log(sql);
        return await dbConnection.query(sql);
    }

    async delete(params) {
        let id = mysql.escape(params.id);
        let post_id = mysql.escape(params.user_id);
        let user_id = mysql.escape(params.post_id);

        let sql = ``;
        //console.log(sql);
        return await dbConnection.query(sql);
    }
}

module.exports = new PostComments("post_comments")