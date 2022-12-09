const mysql = require('mysql2/promise');
const dbConnection = require("../config/db/index.db");
const { Model } = require('./Model');
const { formatDate } = require('../utils/formatters/date-formatter');
const { formatGender } = require('../utils/formatters/gender-formatter');

class Users extends Model {
    constructor(tableName) {
        super(tableName);
    }

    //Caution: mysql.escape('yyyy-mm-dd') = 'yyyy-mm-dd'
    async create(params) {
        let email = mysql.escape(params.email);
        let username = mysql.escape(params.username);
        let password = mysql.escape(params.password);
        let gender = mysql.escape(formatGender(params.gender));
        let avatar_url = mysql.escape(params.avatar_url);
        let description = mysql.escape(params.description);

        let sql = `INSERT INTO ${this.tableName}(email, username, password,\ 
                                gender, avatar_url, description, joined_date, last_active)\
                VALUES(${email}, ${username}, ${password},\ 
                        ${gender}, ${avatar_url}, ${description}, NOW(), NOW())`;
        return await dbConnection.query(sql);
        //Return: {
        //     "fieldCount":,
        //     "affectedRows":,
        //     "insertId":,
        //     "info":"",
        //     "serverStatus":,
        //     "warningStatus":
        // }
    }

    async updateLastActive(params) {
        let user_id = mysql.escape(params.user_id);
        let sql = `UPDATE ${this.tableName} SET last_active=NOW() WHERE id=${user_id}`;
        return await dbConnection.query(sql);
    }
}

//Table name is passed to `constructor`
module.exports = new Users("users");