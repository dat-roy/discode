const siteRouter = require('./site.route')
const userRouter = require('./user.route')

function initRoutes(app) {
    app.use('/api/user', userRouter)
    app.use('/', siteRouter)
}

module.exports = initRoutes