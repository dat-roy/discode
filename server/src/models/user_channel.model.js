const mysql = require('mysql2/promise');
const dbConnection = require("../config/db/index.db");
const { Model } = require('./Model');
const Users = require('./users.model');

class UserChannel extends Model {
    constructor(tableName) {
        super(tableName);
    }

    async create(params) {
        let user_id = mysql.escape(params.user_id);
        let channel_id = mysql.escape(params.channel_id);

        /* ---Without notifiable_id (deprecated)--- */
        // const sql = `INSERT INTO ${this.tableName}(user_id, channel_id)\
        //             VALUES(${user_id}, ${channel_id})`;

        /* --------------------------------------------------------- */
        /* ---Call procedure to be able to insert into notifiable--- */
        const sql = `CALL insert_notifiable_user_channel(${user_id}, ${channel_id}, @user_channel_id)`;
        return {
            insertId: (await dbConnection.query(sql))[0][0]['@user_channel_id'],
        }
        //Result sample from API:
        /*[
            [
                {
                    "@user_channel_id": 28
                }
            ],
            {
                "fieldCount": 0,
                "affectedRows": 0,
                "insertId": 0,
                "info": "",
                "serverStatus": 2,
                "warningStatus": 0
            }
        ] */
    }

    async delete(params) {
        let deleted_id = mysql.escape(params.deleted_id);
        let channel_id = mysql.escape(params.channel_id);

        let sql = `DELETE FROM ${this.tableName}\
                WHERE user_id=${deleted_id} AND channel_id=${channel_id}`;
        return await dbConnection.query(sql);
    }

    async getMembers(params) {
        let channel_id = mysql.escape(params.channel_id)

        const uc = this.tableName;
        const u = Users.tableName;

        let sql = `SELECT\
                    ${uc}.user_id, ${uc}.channel_id,\
                    ${u}.username, ${u}.avatar_url\
                FROM ${uc} INNER JOIN ${u} ON ${uc}.user_id = ${u}.id\
                WHERE ${uc}.channel_id = ${channel_id}`;
        return await dbConnection.query(sql);
    }

    async getChannelByMemberId(params) {
        let member_id = mysql.escape(params.member_id);

        const uc = this.tableName;
        const c = "channels";

        let sql = `SELECT * FROM ${uc}\
                INNER JOIN ${c}\
                WHERE (${uc}.user_id = ${member_id}) AND (${uc}.channel_id = ${c}.id)`;
        return await dbConnection.query(sql);
    }
}

//Table name is passed to `constructor`
module.exports = new UserChannel("user_channel");