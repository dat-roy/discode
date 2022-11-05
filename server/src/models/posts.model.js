const mysql = require('mysql2/promise');
const dbConnection = require("../config/db/index.db");
const { Model } = require('./Model');

class Posts extends Model {
    constructor(tableName) {
        super(tableName);
    }

    async create(params) {
        let author_id = mysql.escape(author_id);
        let content = mysql.escape(content);

        let sql = ``;
        console.log(sql);
        return await dbConnection.query(sql);
    }

    async modify(params) {
        let sql = ``;

        console.log(sql);
        return await dbConnection.query(sql);
    }

    async delete(params) {
        
        let sql = ``;
        console.log(sql);
        return await dbConnection.query(sql);
    }
}

module.exports = new Posts("posts")