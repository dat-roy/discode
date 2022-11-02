const { Model } = require("../models/Model")

class Conversation extends Model {
    constructor(tableName) {
        super(tableName);
    }
}

module.exports = new Conversation("conversation")