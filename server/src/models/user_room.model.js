const mysql = require('mysql2/promise');
const dbConnection = require("../config/db/index.db");
const { RoomTypes } = require('../types/db.type');
const { TABLES } = require('./config');
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
        return await dbConnection.query(sql);
    }

    async delete(params) {
        let deleted_id = mysql.escape(params.deleted_id);
        let room_id = mysql.escape(params.room_id);

        let sql = `DELETE FROM ${this.tableName}\
                WHERE user_id=${deleted_id} AND room_id=${room_id}`;
        return await dbConnection.query(sql);
    }

    async getSingleRoomsByUserID(params) {
        let user_id = mysql.escape(params.user_id);

        const ur = this.tableName;
        const r = TABLES.ROOMS;
        let sql = `SELECT ${ur}.id, ${ur}.user_id, ${ur}.room_id,\
                    ${r}.channel_id, ${r}.type, ${r}.created_at, ${r}.removable\
                FROM ${ur}\
                INNER JOIN ${r} ON ${ur}.room_id = ${r}.id\
                WHERE ${ur}.user_id = ${user_id} AND ${r}.type = '${RoomTypes.SINGLE}'`;
        return await dbConnection.query(sql);
    }

    async getPartnerData(params) {
        let user_id = mysql.escape(params.user_id);
        let room_id = mysql.escape(params.room_id);

        const u = TABLES.USERS;

        let sql = `SELECT * FROM ${this.tableName}\
                INNER JOIN ${u} ON ${this.tableName}.user_id = ${u}.id\
                WHERE ${this.tableName}.user_id != ${user_id} AND ${this.tableName}.room_id = ${room_id}`;
        return (await dbConnection.query(sql))[0];
    }

    async getGroupRooms(params) {
        let user_id = mysql.escape(params.user_id);
        let channel_id = mysql.escape(params.channel_id);

        const ur = this.tableName;
        const r = TABLES.ROOMS;
        const c = TABLES.CHANNELS;

        let sql = `SELECT\
                    ${ur}.user_id,\
                    ${ur}.room_id,\
                    ${r}.channel_id,\
                    ${c}.admin_id,\
                    ${r}.type,\
                    ${r}.title,\
                    ${r}.created_at,\
                    ${r}.removable\
                FROM ${ur}\
                INNER JOIN ${r} ON ${ur}.room_id = ${r}.id\
                INNER JOIN ${c} on ${r}.channel_id = ${c}.id\
                WHERE ${ur}.user_id = ${user_id} AND ${r}.channel_id = ${channel_id}`;
        return await dbConnection.query(sql);
    }
}

module.exports = new UserRoom(TABLES.USER_ROOM)