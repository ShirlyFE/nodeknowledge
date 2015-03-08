

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

connect中常用的中间件有：

### static中间件(最常用的中间件之一)

#### 挂载
static允许将任意一个URL匹配到文件系统中任意一个目录，比如要让**/my-images** URL和名为/images的目录对应起来，可以通过如下方式进行挂载
```javascript
    server.use('my-images', connect.static('/path/to/images'))
```

#### maxAge
static接收名为maxAge的选项，表示一个资源在客户端缓存的事件，比如：将所有的客户端js文件合并为一个文件，并在其文件名上加上修订号，这时设置maxAge选项，让其永远缓存起来
```javascript
    server.use('/js', connect.static('/path/to/bundles', {maxAge: 100000000000}))
```

### query中间件
获取url中查询字符串的数据，使用query中间件就能通过req.query对象自动获取数据，比如url **/blog-posts?page=5**
```javascript
    server.use(connect.query)
    server.use(function(req, res) {
        // req.query.page == '5'
    })
```

### logger中间件
将发送进来的请求信息和发送出去的响应信息打印在终端，提供四种日志格式：
* default: 
* dev: 输出请求方法、请求url、响应状态码、处理时间，是一种精准简短的日志格式，提供性能和行为方面的信息
* short:
* tiny:

logger中间件还允许自定义日志输出格式，比如只想记录请求方法和IP地址
```javascript
    server.use(connect.logger(':method :remote-addr'))
```

也可以通过动态的req和res来记录头信息，记录响应的content-length和content-type信息，可以如下：
```javascript
    server.use(connect.logger('type is :res[content-type], length is :res[content-length] and it took :response-time ms.')) // 注意,zai Node中，请求/响应头都是小写的
```

完整的可用的token包括：
* :req[header] --如：req[Accept]
* :res[header] --如：res[Content-Length]
* :http-version
* :response-time
* :remote-addr
* :date
* :method
* :url
* :referrer
* :user-agent
* :status

logger也可以自定义token，比如给请求Content-Type定义一个简写的:type **token**,可以：
```javascript
    connect.logger.token('type', function(req, res) {
        return req.headers['content-type']
    })
```

### body parser中间件
解析POST请求的消息体
```javascript
    server.use(connect.bodyParser())
```

在req.body中获取POST请求的数据：
```javascript
    server.use(function(req, res) {
        // req.body.myinput
    })
```

如果客户端在POST请求中使用JSON格式，req.body也会将其转换为JSON对象，因为bodyParser会检测Content-Type的值

bodyParser可以使用formidable模块，让你处理用户上传的文件,参看[bodyParser.js](./smashingNodejs/Connect/bodyParser.js)

### cookie 中间件






