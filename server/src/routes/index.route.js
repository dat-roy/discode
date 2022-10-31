const siteRouter = require('./site.route')
const userRouter = require('./user.route')
const searchRouter = require('./search.route')
const testRouter = require('./test.route')

function initRoutes(app) {
    app.use('/api/user', userRouter);
    app.use('/api/search', searchRouter);
    app.use('/api/test', testRouter)
    app.use('/', siteRouter)
}

module.exports = initRoutes