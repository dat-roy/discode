const mysql = require('mysql2/promise');
const dbConnection = require("../config/db/index.db");
const { NotiSourceTypes } = require('../types/db.type');
const { Model } = require('./Model');
const { TABLES } = require('./config');

class ChannelRequests extends Model {
    constructor(tableName) {
        super(tableName);
    }
    async create(params) {
        let user_id = mysql.escape(params.user_id);
        let channel_id = mysql.escape(params.channel_id);

        const noti_i = TABLES.NOTIFIABLE;
        const cr = this.tableName;
        let sql = `INSERT INTO ${noti_i}(source_type)\
                    SELECT '${NotiSourceTypes.USER}'\
                    WHERE NOT EXISTS (\
                        SELECT 1 FROM ${cr} WHERE user_id=${user_id} AND channel_id=${channel_id}\
                    ) LIMIT 1;

                INSERT INTO ${cr}(user_id, channel_id, notifiable_id)\
                SELECT ${user_id}, ${channel_id}, (SELECT MAX(id) FROM ${noti_i})\
                WHERE NOT EXISTS (\
                    SELECT 1 FROM ${cr} WHERE user_id=${user_id} AND channel_id=${channel_id}\
                ) LIMIT 1;

                SELECT id AS insertId, notifiable_id FROM ${this.tableName}\
                    WHERE user_id=${user_id} AND channel_id=${channel_id}`;
        return (await dbConnection.query(sql))[2][0];
    }
}

module.exports = new ChannelRequests(TABLES.CHANNEL_REQUESTS);