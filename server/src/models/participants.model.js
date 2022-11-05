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
}

//Table name is passed to `constructor`
module.exports = new Participants("participants");