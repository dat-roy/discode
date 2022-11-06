const { Model } = require('./Model')
const mysql = require('mysql2/promise');
const dbConnection = require("../config/db/index.db");
class UserChannel extends Model {
    constructor(tableName) {
        super(tableName);
    }

    async create(params) {
        let user_id = mysql.escape(params.user_id);
        let channel_id = mysql.escape(params.channel_id);

        let sql = `INSERT INTO ${this.tableName}(user_id, channel_id)\
                    VALUES(${user_id}, ${channel_id})`;
        //console.log(sql);
        return await dbConnection.query(sql);
    }

    async delete(params) {
        let deleted_id = mysql.escape(params.deleted_id);
        let channel_id = mysql.escape(params.channel_id);

        let sql = `DELETE FROM ${this.tableName}\
                WHERE user_id=${deleted_id} AND channel_id=${channel_id}`;
        //console.log(sql);
        return await dbConnection.query(sql);
    }
}

//Table name is passed to `constructor`
module.exports = new UserChannel("user_channel");