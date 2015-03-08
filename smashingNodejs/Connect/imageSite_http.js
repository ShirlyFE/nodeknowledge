var http = require("http"),
    fs = require('fs')

var server = http.createServer(function(req, res) {
    if (req.method == 'GET' && req.url.substr(0, 7) === '/images' && req.url.substr(-4) === '.jpg') {
        fs.stat(__dirname + req.url, function(err, stat) {
            if (err || !stat.isFile()) {
                res.writeHead(404)
                res.end('Not Found')
                return
            }
            serve(__dirname + req.url, 'application/jpg', res)
        })
    } else if (req.method == 'GET' && req.url == '/') {
        serve(__dirname + '/imageSite.html', 'text/html', res)
    } else {
        res.writeHead(404)
        res.end('Not Found')
    }
})

function serve(path, type, res) {
    res.writeHead(200, {'Content-Type': type})
    fs.createReadStream(path).pipe(res) // http响应对象是一个只写流，从文件创建出来的流失只读的，因此可以将文件系统流接到(pipe)HTTP响应流中
    /*
        上面简洁代码其实等同于:
        fs.createReadStream(path)
            .on('data', function(data) {
                res.write(data)
            })
            .on('end', function() {
                res.end()
            })
    */
}

server.listen(3000)
console.log('listening to http://127.0.0.1:3000')