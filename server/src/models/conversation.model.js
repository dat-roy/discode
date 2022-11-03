const mysql = require('mysql2/promise');
const dbConnection = require("../config/db/index.db");
const { Model } = require('./Model');

class Conversation extends Model {
    constructor(tableName) {
        super(tableName);
    }

    async createNewChannel(id, title) {
        let sql = `INSERT INTO ${this.tableName}(creator_id, title, created_at)
        VALUES(${id}, "${title}", NOW())`;

        return await dbConnection.query(sql);
    }

    async deleteChannel(user_id, conversation_id) {
        let sql = `DELETE FROM ${this.tableName} WHERE id = ${conversation_id} AND creator_id = ${user_id}`;
        console.log(sql);
        return await dbConnection.query(sql);
    }
}

module.exports = new Conversation("conversation")