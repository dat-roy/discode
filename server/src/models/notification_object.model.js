const mysql = require('mysql2/promise');
const dbConnection = require("../config/db/index.db");
const { Model } = require('./Model');

class NotificationObject extends Model{
    constructor(tablename) {
        super(tablename);
    }

    async createNotification(params) {
        let notification_type = mysql.escape(params.notification_type);
        let entity_id = mysql.escape(params.entity_id);
        
        let sql = `INSERT INTO ${this.tableName}(notification_type, entity_id, created_at)
        VALUES(${notification_type}, ${entity_id}, NOW())`;
        //console.log(sql);
        return dbConnection.query(sql);
    }
}

module.exports = new NotificationObject("notification_object")