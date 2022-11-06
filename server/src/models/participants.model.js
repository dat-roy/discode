const { Model } = require('./Model')
const dbConnection = require("../config/db/index.db");
class Participants extends Model {
    constructor(tableName) {
        super(tableName);
    }

    async deleteMember(deleted_id, conv_id) {
        let sql = `DELETE FROM ${this.tableName} WHERE users_id = ${deleted_id} AND conv_id = ${conv_id}`;
        console.log(sql);
        return dbConnection.query(sql);
    }

    async addMember(req_id, conv_id) {
        let sql = `INSERT INTO ${this.tableName}(conv_id, users_id, created_at, updated_at, type)
        VALUES(${conv_id}, ${req_id}, NOW(), NOW(), 'single') `;
        console.log(sql);
        return dbConnection.query(sql);
    }

    
}

//Table name is passed to `constructor`
module.exports = new Participants("participants");