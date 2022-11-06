const mysql = require('mysql2/promise');
const dbConnection = require("../config/db/index.db");
const { RoomTypes } = require('../types/db.type');
const { Model } = require('./Model');
const Room = require('./room.model')

class UserRoom extends Model {
    constructor(tableName) {
        super(tableName);
    }

    async create(params) {
        let user_id = mysql.escape(params.user_id);
        let room_id = mysql.escape(params.room_id);

        let sql = `INSERT INTO ${this.tableName}(user_id, room_id)\
                    VALUES(${user_id}, ${room_id})`;
        //console.log(sql);
        return await dbConnection.query(sql);
    }

    async delete(params) {
        let deleted_id = mysql.escape(params.deleted_id);
        let room_id = mysql.escape(params.room_id);

        let sql = `DELETE FROM ${this.tableName}\
                WHERE user_id=${deleted_id} AND room_id=${room_id}`;
        //console.log(sql);
        return await dbConnection.query(sql);
    }

    async getSingleRoomsByUserID(params) {
        let user_id = mysql.escape(params.user_id);
        let sql = `SELECT * FROM ${this.tableName}\
                RIGHT JOIN ${Room.tableName} ON ${this.tableName}.room_id = ${Room.tableName}.id\
                WHERE ${this.tableName}.user_id = ${user_id} AND ${Room.tableName}.type = '${RoomTypes.SINGLE}'`;
        //console.log(sql);
        return await dbConnection.query(sql);
    }
}

module.exports = new UserRoom("user_room")