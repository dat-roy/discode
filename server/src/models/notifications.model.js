const mysql = require('mysql2/promise');
const dbConnection = require("../config/db/index.db");
const { TABLES } = require('./config');
const { Model } = require('./Model');

class Notifications extends Model {
    constructor(tablename) {
        super(tablename);
    }

    async create(params) {
        let notifiable_id = mysql.escape(params.notifiable_id);
        let type = mysql.escape(params.type);

        //Note: using "insert ignore" will cause auto_increment keys 
        // still increment even when a duplication occurs.
        // let sql = `INSERT IGNORE INTO ${this.tableName}(notifiable_id, type)\
        //             VALUES(${notifiable_id}, ${type});
        //         SELECT id AS insertId FROM ${this.tableName}\
        //             WHERE notifiable_id=${notifiable_id} AND type=${type}`;
        // return (await dbConnection.query(sql))[1][0];

        let sql = `INSERT INTO ${this.tableName}(notifiable_id, type)\
                SELECT ${notifiable_id}, ${type}\
                WHERE NOT EXISTS (\
                    SELECT 1 FROM ${this.tableName} WHERE notifiable_id=${notifiable_id} AND type=${type}\
                ) LIMIT 1;
                
                SELECT id AS insertId FROM ${this.tableName}\
                    WHERE notifiable_id=${notifiable_id} AND type=${type}`;
        return (await dbConnection.query(sql))[1][0];
    }
}

module.exports = new Notifications(TABLES.NOTIFICATIONS)