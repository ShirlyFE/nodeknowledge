var connect = require('connect'),
    server = connect.createServer()
// 使用use方法来添加static中间件
server.use(connect.static(__dirname + '/'))

server.listen(3000)

console.log('listen to http://127.0.0.1:3000')