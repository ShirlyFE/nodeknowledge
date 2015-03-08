

## Connect

Connect是一个基于HTTP服务器的工具集，提供了一种新的组织代码的方式与请求、响应对象交互，称为中间件；它让一些重复性的处理便于实现，从而让开发者能够更加专注在应用本身，很好的体现了DRY(Don't Repeat Yourself)模式

假设我们有一个图片展示的站点，通过HTTP构建的代码如下请看:[imageSite_http.js](./smashingNodejs/Connect/imageSite_http.js)

connect的实现代码如下([imageSite_connect.js](./smashingNodejs/Connect/imageSite_connect.js)):
```javascript
    var connect = require('connect'),
    server = connect.createServer()
    // 使用use方法来添加static中间件
    server.use(connect.static(__dirname + '/')) // 托管静态文件
    server.listen(3000)
```
Connect也自动帮我们处理404的情况，我们可以通过访问错误的地址试试，是不是很干净清爽

Connect的一个核心概念是中间件，所谓中间件其实就是一个简单的js函数，它除了处理req和res对象之外，还接收next函数来做流控制

对于上面的图片展示站点，如果我们要求能够根据每个请求的不同情况处理以下几种任务：
* 记录请求处理时间
* 托管静态文件
* 处理授权
我们用中间件的模式书写的话会是这样的：
```javascript
    server.use(function(req, res, next) {
        // 记录日志
        console.error(' %s %s ', req.method, req.url)
        next()
    })
    server.use(function(req, res, next) {
        if (req.method == 'GET' && req.url.substr(0, 7) === '/images') {
            // 托管图片
        } else {
            // 交给其他的中间件去处理
            next()
        }
    })
    server.use(function(req, res, next) {
        if (req.method == 'GET' && req.url === '/') {
            // 响应index文件
        } else {
            // 交给其他中间件去处理
            next()
        }
    })
    server.use(function(req, res, next) {
        // 最后一个中间件，如果到了这里，就意味着无能为力，只能返回404了
        res.writeHead(404)
        res.end('Not Found')
    })
```
可见使用中间件，不仅能让代码有更强大的表达能力(将应用拆分为更小单元的能力)，还能实现很好的重用性，看一个当[请求时间过长而进行提醒的中间件的demo](./smashingNodejs/Connect/timeMiddleware.js)








