const mysql = require('mysql2/promise');
const dbConnection = require("../config/db/index.db");
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
        //console.log(sql);
        return await dbConnection.query(sql);
    }

    async delete(params) {
        const post_id = mysql.escape(params.post_id);
        const tag_name = mysql.escape(params.tag_name);
        
        let sql = `DELETE FROM ${this.tableName} WHERE post_id=${post_id} AND tag_name=${tag_name}`;
        //console.log(sql);
        return await dbConnection.query(sql);
    }
}

module.exports = new Tags("tags")