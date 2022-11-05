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
        let birthday = formatDate(params.birthday);
        let password = mysql.escape(params.password);
        let gender = mysql.escape(formatGender(params.gender));
        let avatar_url = mysql.escape(params.avatar_url);
        let nation = mysql.escape(params.nation);

        let sql = `INSERT INTO ${this.tableName}(email, username, birthday, password,\ 
                                gender, avatar_url, nation, joined_date)\
                VALUES(${email}, ${username}, ${birthday}, ${password},\ 
                        ${gender}, ${avatar_url}, ${nation}, NOW())`;
        console.log(sql);
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
}

//Table name is passed to `constructor`
module.exports = new Users("users");