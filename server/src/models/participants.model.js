const { Model } = require('./Model')

class Participants extends Model {
    constructor(tableName) {
        super(tableName);
    }
}

//Table name is passed to `constructor`
module.exports = new Participants("participants");