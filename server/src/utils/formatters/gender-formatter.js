const { GenderTypes } = require('../../types/db.type');

const formatGender = (gender) => {
    if (! gender || ! Object.values(GenderTypes).includes(gender)) {
        return GenderTypes.OTHER;
    }
    return gender;
}

module.exports = {
    formatGender,
}