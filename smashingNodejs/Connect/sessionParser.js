var connect = require('connect'),
    users = require('./users'),
    server = connect.createServer()

server.use(connect.logger('dev'))
server.use(connect.bodyParser())
server.use(connect.cookieParser())
server.use(connect.session({secret: 'my app secret'}))
server.use(function(req, res, next) {
    if (req.url == '/' && req.session.loggin_in) {
        res.writeHead(200, {'Content-Type': 'text/html'})
        res.end('Welcome back, <b>' + req.session.name + '</b>.' + '<a href="/logout">Logout</a>')
    } else {
        next()
    }
})

server.use(function(req, res, next) {
    if (req.method == 'GET' && req.url == '/') {
        res.writeHead(200, {'Content-Type': 'text/html'})
        res.end(['<form action="login" method="POST">',
            '<filed><legend>Please log in</legend>',
            '<p>User: <input type="text" name="user"></p>',
            '<p>Password: <input type="password" name="password"></p>',
            '<button>Submit</button>',
            '</filed></form>'].join(''))
    } else {
        next()
    }
})

server.use(function(req, res, next) {
    if (req.method == 'POST' && req.url == '/login') {
        res.writeHead(200)
        if (!users[req.body.user] || req.body.password != users[req.body.user].password) {
            res.end('Bad username/password')
        } else {
            req.session.loggin_in = true
            req.session.name = users[req.body.user].name
            res.end('Authenticated!')
        }
    } else {
        next()
    } 
})

server.use(function(req, res, next) {
    if (req.url == '/logout') {
        req.session.loggin_in = false
        res.writeHead(200)
        res.end('Loggod out!')
    } else {
        next()
    }
})

server.listen(3000)

console.log('listening to http://127.0.0.1:3000')
