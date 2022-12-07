const mysql = require('mysql2/promise');
const dbConnection = require("../config/db/index.db");
const { Model } = require('./Model');

class Notifications extends Model{
    constructor(tablename) {
        super(tablename);
    }

    async create(params) {
        let notifiable_id = mysql.escape(params.notifiable_id);
        let type = mysql.escape(params.type);
        
        let sql = `INSERT IGNORE INTO ${this.tableName}(notifiable_id, type)\
                    VALUES(${notifiable_id}, ${type});
                SELECT id AS insertId FROM ${this.tableName}\
                    WHERE notifiable_id=${notifiable_id} AND type=${type}`;
        return (await dbConnection.query(sql))[1][0];
    }
}

module.exports = new Notifications("notifications")