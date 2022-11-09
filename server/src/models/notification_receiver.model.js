const mysql = require('mysql2/promise');
const dbConnection = require("../config/db/index.db");
const { Model } = require('./Model');

class NotificationReceiver extends Model {
    constructor(tablename) {
        super(tablename);
    }

    async createNotificationReceiver(params) {
        let notification_object_id = mysql.escape(params.notification_object_id);
        let receiver_id = mysql.escape(params.receiver_id);
        
        let sql = `INSERT INTO ${this.tableName}(notification_object_id, receiver_id, status)
        VALUES(${notification_object_id}, ${receiver_id}, 0)`;
        return dbConnection.query(sql);
    }
}

module.exports = new NotificationReceiver("notification_receiver")
