const siteRouter = require('./site.route')
const userRouter = require('./user.route')
const searchRouter = require('./search.route')
const chatRouter = require('./chat.route')
const channelRouter = require('./channel.route')
const messageRouter = require('./message.route')
const postRouter = require('./post.route')
const notiRouter = require('./notification.route')

const testRouter = require('./test.route')

function initRoutes(app) {
    app.use('/api/user', userRouter)
    app.use('/api/search', searchRouter)
    app.use('/api/chat', chatRouter)
    app.use('/api/channel', channelRouter)
    app.use('/api/message', messageRouter)
    app.use('/api/post', postRouter)
    app.use('/api/notification', notiRouter)

    app.use('/api/test', testRouter)
    app.use('/', siteRouter)
}

module.exports = initRoutes