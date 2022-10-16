class siteController {
    //[GET] /
    home(req, res) {
        res.status(200).json({
            message: `Hello discode`,
        })
    }

}

module.exports = new siteController();