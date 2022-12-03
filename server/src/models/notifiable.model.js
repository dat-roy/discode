//const mysql = require('mysql2/promise');
//const dbConnection = require("../config/db/index.db");
const { Model } = require('./Model');

class Notifiable extends Model {
    constructor(tablename) {
        super(tablename);
    }

    async create() {
        //Note: A new record can not be inserted explicitly!
        //Instead, it is called in MySQL procedures:   
        //  + (insert_notifiable_user_channel.
        //  + insert_notifiable_post_comments.
    }   
}

module.exports = new Notifiable("notifiable")