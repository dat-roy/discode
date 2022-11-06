const mysql = require('mysql2/promise');
const dbConnection = require("../config/db/index.db");
const { Model } = require('./Model');

class PostComments extends Model {
    constructor(tableName) {
        super(tableName);
    }

    async create(params) {
        let post_id = mysql.escape(params.post_id);
        let user_id = mysql.escape(params.user_id);
        let content = mysql.escape(params.content);

        let sql = ``;
        //console.log(sql);
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

module.exports = new PostComments("post_comment")