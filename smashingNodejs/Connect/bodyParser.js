var connect = require('connect'),
    fs = require('fs'),
    server = connect.createServer()

server.use(connect.bodyParser())

server.use(connect.static('static'))

server.use(function(req, res, next) {
    if (req.method == 'POST') {
        // 如果同时有多个file输入域则req.files是个数组，每一个数组元素是一个文件对象，多个file输入域需要在dom上设置name='files[]'标志
        if (req.files.file) {
            fs.readFile(req.files.file.path, 'utf8', function(err, data) {
                if (err) {
                    res.writeHead(500)
                    res.end('Error!')
                    return
                }
                res.writeHead(200, {'Content-Type': 'text/html'})
                res.end(['<h3>File: '+req.files.file.name+'</h3>', 
                    '<h4>Type: '+req.files.file.type+'</h4>',
                    '<h4>Contents:</h4><pre>'+data+'</pre>'].join('')) 
            }) 
        } else { // 如果file域不设置name则默认是name='files[]'
            res.end('multiple files posted') 
        }
    } else {
        next()
    }
})

server.listen(3000)

console.log('listening to http://127.0.0.1:3000')

