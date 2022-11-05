class testController {
    //[GET] /api/test/get 
    //Used for testing purpose only.
    async testGet(req, res, next) {
        return res.json({
            datetime: require('moment')().format('YYYY-MM-DD HH:mm:ss')
        })
    }
    //[POST] /api/test/post
    //Used for testing purpose only.
    async testPost(req, res, next) {

    }
}

module.exports = new testController();