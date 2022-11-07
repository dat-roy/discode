const mysql = require('mysql2/promise');
const dbConnection = require("../config/db/index.db");
const { Model } = require('./Model');

class NotificationReceiver extends Model {
    constructor(tablename) {
        super(tablename);
    }
}

module.exports = new NotificationReceiver("notification_receiver")
