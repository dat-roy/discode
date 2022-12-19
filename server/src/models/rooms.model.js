const mysql = require('mysql2/promise');
const dbConnection = require("../config/db/index.db");
const { Model } = require('./Model');
const { RoomTypes } = require('../types/db.type');
const { TABLES } = require('./config');

class Rooms extends Model {
    constructor(tableName) {
        super(tableName);
    }

    async create(params) {
        let type = mysql.escape(params.type);
        let channel_id = (type === RoomTypes.SINGLE)
            ? null : mysql.escape(params.channel_id);
        let title = mysql.escape(params.title);
        let removable = mysql.escape(params.removable);

        let sql = `INSERT INTO\ 
            ${this.tableName}(channel_id, type, title, removable, created_at)\
            VALUES(${channel_id}, ${type}, ${title}, ${removable}, NOW())`;

        return await dbConnection.query(sql);
    }

    async delete(params) {
        let { room_id, removable } = params;
        if (!removable) {
            return "Deleting this room is restricted"
        }
        let sql = `DELETE FROM ${this.tableName} WHERE id = ${room_id}`;
        return await dbConnection.query(sql);
    }
}

module.exports = new Rooms(TABLES.ROOMS)