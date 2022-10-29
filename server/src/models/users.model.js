const mysql = require('mysql2/promise');
const dbConnection = require("../config/db/index.db");
const { formatDate } = require('../utils/formatters/date-formatter');
const { formatGender } = require('../utils/formatters/gender-formatter');

/**
 * Note: mysql.escape() can help change `undefined` to `NULL` before inserting into database.
 */

const getAttributes = async (options) => {
    let attributes = '*';
    if (options && options.attributes) {
        attributes = options.attributes.join(', ');
    }
    return attributes;
}

const getWhereClause = async (options) => {
    let whereClause = '';
    if (options && options.where) { 
        whereClause = `WHERE `;
        if (typeof options.where === 'string') {
            whereClause += options.where;
        } else {
            const key = Object.keys(options.where)[0];
            const value = mysql.escape(Object.values(options.where)[0]);
            whereClause += `${key}=${value}`; 
        }
    }
    return whereClause;
}

class Users {
    static tableName = "users";

    async findAll(options) {
        let attributes = await getAttributes(options);
        let whereClause = await getWhereClause(options);
        let sql = `SELECT ${attributes} FROM ${Users.tableName} ${whereClause}`;
        return await dbConnection.query(sql);
    }

    async findOne(options) {
        let attributes = await getAttributes(options);
        let whereClause = await getWhereClause(options);
        let sql = `SELECT ${attributes} FROM ${Users.tableName} ${whereClause} LIMIT 1`;
        return (await dbConnection.query(sql))[0];
    }

    async checkExistence(options) {
        let whereClause = await getWhereClause(options);
        let sql = `SELECT EXISTS(SELECT * FROM ${Users.tableName} ${whereClause}) AS existence`;
        return (await dbConnection.query(sql))[0].existence;
    }

    //Caution: mysql.escape('yyyy-mm-dd') = 'yyyy-mm-dd'
    async create(params) {
        let email = mysql.escape(params.email);
        let username = mysql.escape(params.username);
        let birthday = formatDate(params.birthday);
        let password = mysql.escape(params.password);
        let gender = mysql.escape(formatGender(params.gender));
        let avatar_url = mysql.escape(params.avatar_url);

        let sql = `INSERT INTO ${Users.tableName}(id, email, username, birthday, password, gender, avatar_url)\
                VALUES(NULL, ${email}, ${username}, ${birthday}, ${password}, ${gender}, ${avatar_url})`;

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

module.exports = new Users();