const Users = require('../models/users.model')

class searchController {
    //[GET] /api/search/user/:param
    async searchUser(req, res, next) {
        const { param } = req.params;
        if (param === '') {
            return res.status(200).json({
                message: "Empty query value",
                results: null,
            })
        }
        
        try {
            const results = await Users.findAll({
                attributes: [
                    "username", "email", 
                ],
                where: 
                    `username LIKE '%${param}%' `
                    + `OR SUBSTRING(email FROM 1 FOR LOCATE('@', email)) LIKE '%${param}%'`,
                    // `MATCH(username, email)  AGAINST ('${param}' IN NATURAL LANGUAGE MODE)`
            })
            console.log(results);
            return res.status(200).json({
                results: results
            })
        } catch (err) {
            console.log(err.message);
            return res.status(500).json({
                message: "An internal error from server"
            })
        }
    }
}

module.exports = new searchController();