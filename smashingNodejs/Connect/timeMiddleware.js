var connect = require('connect'),
    time = require('./request-time')

var server = connect.createServer()

/**
 * 记录请求情况
 */
server.use(connect.logger('dev'))

/**
 * 实现时间中间件
 */
server.use(time({time: 500}))

/**
 * 快速响应
 */
server.use(function(req, res, next) {
    if (req.url == '/a') {
        res.writeHead(200)
        res.end('Fast!')
    } else {
        next()
    }
})

/**
 * 慢速响应
 */
server.use(function(req, res, next) {
    if (req.url == '/b') {
        setTimeout(function() {
            res.writeHead(200)
            res.end('Slow!')    
        }, 1000)
    } else {
        next()
    }
})

server.listen(3000)

console.log('listening to http://127.0.0.1:3000')
