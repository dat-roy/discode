const mysql = require('mysql2/promise');
const dbConnection = require("../config/db/index.db");
const { Model } = require('./Model');

class Channels extends Model {
    constructor(tableName) {
        super(tableName);
    }

    async create(params) {
        let admin_id = mysql.escape(params.admin_id);
        let title = mysql.escape(params.title);
        let description = mysql.escape(params.description);
        let avatar_url = mysql.escape(params.avatar_url);

        let sql = `INSERT INTO\ 
            ${this.tableName}(admin_id, title, description, avatar_url, created_at)\
            VALUES(${admin_id}, ${title}, ${description}, ${avatar_url}, NOW())`;
        console.log(sql);

        return await dbConnection.query(sql);
    }

    async delete(params) {
        let admin_id = mysql.escape(params.admin_id);
        let channel_id = mysql.escape(params.channel_id);

        let sql = `DELETE FROM ${this.tableName} WHERE id=${channel_id} AND admin_id=${admin_id}`;
        console.log(sql);
        return await dbConnection.query(sql);
    }
}

module.exports = new Channels("channels")