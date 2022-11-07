const mysql = require('mysql2/promise');
const dbConnection = require("../config/db/index.db");
const { Model } = require('./Model');

class postLikes extends Model {
    constructor(tablename) {
        super(tablename);
    }

    async create(params) {
        let post_id = mysql.escape(params.post_id);
        let user_id = mysql.escape(params.user_id);

        let sql = `INSERT INTO ${this.tableName}(post_id, user_id) 
        VALUES(${post_id}, ${user_id})`;
        console.log(sql);
        return await dbConnection.query(sql);
    }


}

module.exports = new postLikes('post_likes')