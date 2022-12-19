const mysql = require('mysql2/promise');
const dbConnection = require("../config/db/index.db");
const { TABLES } = require('./config');
const { Model } = require('./Model');

class Tags extends Model {
    constructor(tableName) {
        super(tableName);
    }

    async create(params) {
        const post_id = mysql.escape(params.post_id);
        const tag_name = mysql.escape(params.tag_name);

        let sql = `INSERT INTO\
                ${this.tableName}(post_id, tag_name)\
                VALUES(${post_id}, ${tag_name})`;
        return await dbConnection.query(sql);
    }

    async delete(params) {
        const post_id = mysql.escape(params.post_id);
        const tag_name = mysql.escape(params.tag_name);

        let sql = `DELETE FROM ${this.tableName} WHERE post_id=${post_id} AND tag_name=${tag_name}`;
        return await dbConnection.query(sql);
    }


    async getFeaturedTopics() {
        let sql = `SELECT tag_name, COUNT(post_id) as number\
                    FROM ${this.tableName}\
                    GROUP BY tag_name\
                    ORDER BY number DESC LIMIT 15`
        return dbConnection.query(sql);
    }
}

module.exports = new Tags(TABLES.TAGS)