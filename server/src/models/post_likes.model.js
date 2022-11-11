const mysql = require('mysql2/promise');
const dbConnection = require("../config/db/index.db");
const { Model } = require('./Model');

class PostLikes extends Model {
    constructor(tablename) {
        super(tablename);
    }

    async create(params) {
        let post_id = mysql.escape(params.post_id);
        let user_id = mysql.escape(params.user_id);
        let liked = mysql.escape(params.liked);

        let sql = `INSERT INTO ${this.tableName}(post_id, user_id, liked)\
            VALUES(${post_id}, ${user_id}, TRUE)\
            ON DUPLICATE KEY UPDATE liked = ${liked}`;
        //console.log(sql);
        return await dbConnection.query(sql);
    }

    async fetchLikesNumber(params) {
        const post_id = mysql.escape(params.post_id);
        let sql = `SELECT COUNT(*) AS number FROM ${this.tableName} WHERE post_id = ${post_id} AND liked=TRUE`;
        //console.log(sql);
        return (await dbConnection.query(sql))[0];
    }
}

module.exports = new PostLikes('post_likes')