const mysql = require('mysql2/promise');
const dbConnection = require("../config/db/index.db");

/**
 * Note: mysql.escape() can help change `undefined` to `NULL` before inserting into database.
 */

class Model {
    constructor(tableName) {
        this.tableName = tableName;
    }

    getAttributes = async (options) => {
        let attributes = '*';
        if (options && options.attributes) {
            attributes = options.attributes.join(', ');
        }
        return attributes;
    }
    
    getWhereClause = async (options) => {
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

    async findAll(options) {
        let attributes = await this.getAttributes(options);
        let whereClause = await this.getWhereClause(options);
        let sql = `SELECT ${attributes} FROM ${this.tableName} ${whereClause}`;
        //console.log(sql);
        return await dbConnection.query(sql);
    }

    async findOne(options) {
        let attributes = await this.getAttributes(options);
        let whereClause = await this.getWhereClause(options);
        let sql = `SELECT ${attributes} FROM ${this.tableName} ${whereClause} LIMIT 1`;
        return (await dbConnection.query(sql))[0];
    }

    async checkExistence(options) {
        let whereClause = await this.getWhereClause(options);
        let sql = `SELECT EXISTS(SELECT * FROM ${this.tableName} ${whereClause}) AS existence`;
        console.log(sql);
        return (await dbConnection.query(sql))[0].existence;
    }
}

module.exports.Model = Model;