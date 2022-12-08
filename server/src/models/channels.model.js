const mysql = require('mysql2/promise');
const dbConnection = require("../config/db/index.db");
const { Model } = require('./Model');
const UserChannels = require('./user_channel.model');

class Channels extends Model {
    constructor(tableName) {
        super(tableName);
    }

    async create(params) {
        let admin_id = mysql.escape(params.admin_id);
        let title = mysql.escape(params.title);
        let description = mysql.escape(params.description);
        let avatar_url = mysql.escape(params.avatar_url);
        let background_url = mysql.escape(params.background_url);

        let sql = `INSERT INTO\ 
            ${this.tableName}(admin_id, title, description, avatar_url, background_url, created_at)\
            VALUES(${admin_id}, ${title}, ${description}, ${avatar_url}, ${background_url}, NOW())`;

        return await dbConnection.query(sql);
    }

    async delete(params) {
        let admin_id = mysql.escape(params.admin_id);
        let channel_id = mysql.escape(params.channel_id);

        let sql = `DELETE FROM ${this.tableName} WHERE id=${channel_id} AND admin_id=${admin_id}`;
        return await dbConnection.query(sql);
    }

    async getFeaturedChannelsDTB() {
        let sql = `SELECT c.id, numOfMem.Members\
        FROM ${this.tableName} c\
        INNER JOIN (SELECT uc.channel_id, COUNT(uc.id) as Members FROM ${UserChannels.tableName} uc GROUP BY uc.channel_id) numOfMem\
        ON c.id = numofMem.channel_id\
        ORDER BY numOfMem.Members DESC LIMIT 3;`

        return await dbConnection.query(sql);
    }
}

module.exports = new Channels("channels")