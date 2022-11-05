const mysql = require('mysql2/promise');
const dbConnection = require("../config/db/index.db");
const { Model } = require('./Model');

class UserRoom extends Model {
    constructor(tableName) {
        super(tableName);
    }

    async create(params) {
        let user_id = mysql.escape(params.user_id);
        let room_id = mysql.escape(params.room_id);

        let sql = `INSERT INTO ${this.tableName}(user_id, room_id)\
                    VALUES(${user_id}, ${room_id})`;
        console.log(sql);
        return await dbConnection.query(sql);
    }

    async delete(params) {
        let deleted_id = mysql.escape(params.deleted_id);
        let room_id = mysql.escape(params.room_id);

        let sql = `DELETE FROM ${this.tableName}\
                WHERE user_id=${deleted_id} AND room_id=${room_id}`;
        console.log(sql);
        return await dbConnection.query(sql);
    }
}

module.exports = new UserRoom("user_room")