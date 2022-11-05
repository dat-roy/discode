const mysql = require('mysql2/promise');
const dbConnection = require("../config/db/index.db");
const { Model } = require('./Model');
const { formatDate } = require('../utils/formatters/date-formatter');
const { formatGender } = require('../utils/formatters/gender-formatter');
const moment = require('moment')

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
        let joined_date = mysql.escape(moment().format('YYYY-MM-DD HH:mm:ss'));
        let nation = mysql.escape(params.nation);

        let sql = `INSERT INTO ${this.tableName}(id, email, username, birthday, password,\ 
                                gender, avatar_url, joined_date, nation)\
                VALUES(NULL, ${email}, ${username}, ${birthday}, ${password},\ 
                        ${gender}, ${avatar_url}, ${joined_date}, ${nation})`;
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