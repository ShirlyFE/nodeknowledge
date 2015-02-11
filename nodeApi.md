### require
require 用来require modules。but require isn't actually a global but rather local to each module.

require()

require.resolve(module)
> 查找解析module的path，但是不加载module，返回完整的module路径。同执行环境中__filename的返回状态一致

__filename and __dirname isn't actually a global but rather local to each module.

Example: running node example.js from /Users/mjr
```javascript
    console.log(__filename); // /Users/mjr/example.js
    console.log(__dirname); // /Users/mjr
```

require.cache


### timer

定时器对象的unref方法与ref方法

如前所述，setTimeout方法与setInterval函数均返回一个定时器对象。在Node.js中，为定时器对象定义了一个unref方法与一个ref方法，接下来，我们对这两个方法进行详细介绍。

当使用setTimeout函数指定过多少毫秒调用某个回调函数或使用setInterval函数指定每隔多少毫秒调用某个回调函数后，可以使用setTimeout函数或setInterval函数返回的定时器对象的unref方法取消setTimeout函数或setInterval函数中指定的回调函数的调用

```javascript
    var testFunction=function(){  
    console.log("callback function executed.");  
    }  
    var timer=setInterval(testFunction,3000);  
    timer.unref(); 
```

当使用定时器对象的unref方法取消回调函数的调用后，仍可使用该定时器对象的ref方法恢复回调函数的调用，如果定时器为setTimeout函数返回的定时器，则在ref方法被调用的时刻经过一段时间（即setTimeout函数中指定的毫秒数）之后调用setTimeout函数中指定的回调函数；如果定时器为setInterval函数返回的定时器，则在ref方法被调用的时刻之后每隔一段时间（即setInterval函数中指定的毫秒数）调用setInterval函数中指定的回调函数。

需要注意的是：In the case of setTimeout when you unref you create a separate timer that will wakeup the event loop, creating too many of these may adversely effect event loop performance -- use wisely.

#### setImmediate(callback, [arg], [...]) 对应于clearImmediate

Immediates are queued in the order created, and are popped off the queue once per loop iteration. This is different from process.nextTick which will execute process.maxTickDepth queued callbacks per iteration. setImmediate will yield to the event loop after firing a queued callback to make sure I/O is not being starved. While order is preserved for execution, other I/O events may fire between any two scheduled immediate callbacks.

### Caching

Modules are cached after the first time they are loaded. This means (among other things) that every call to require('foo') will get exactly the same object returned, if it would resolve to the same file.

Multiple calls to require('foo') may not cause the module code to be executed multiple times. This is an important feature. With it, "partially done" objects can be returned, thus allowing transitive dependencies to be loaded even when they would cause cycles.

If you want to have a module execute code multiple times, then export a function, and call that function.

### Module Caching Caveats

Modules are cached based on their resolved filename. Since modules may resolve to a different filename based on the location of the calling module (loading from node_modules folders), it is not a guarantee that require('foo') will always return the exact same object, if it would resolve to different files.

### Accessing the main module

When a file is run directly from Node, require.main is set to its module. That means that you can determine whether a file has been run directly by testing

> require.main === module

the entry point of the current application can be obtained by checking require.main.filename.

##process

The process object is a global object and can be accessed from anywhere. It is an instance of EventEmitter.

### Event: 'exit'

Emitted when the process is about to exit. There is no way to prevent the exiting of the event loop at this point, and once all exit listeners have finished running the process will exit. Therefore you must only perform synchronous operations in this handler. This is a good hook to perform checks on the module's state (like for unit tests). The callback takes one argument, the code the process is exiting with.

### process.stdin
A Readable Stream for stdin (on fd 0).

Example of opening standard input and listening for both events:
```javascript
    process.stdin.setEncoding('utf8');

    process.stdin.on('readable', function() {
      var chunk = process.stdin.read();
      if (chunk !== null) {
        process.stdout.write('data: ' + chunk);
      }
    });

    process.stdin.on('end', function() {
      process.stdout.write('end');
    }); 
```

### process.argv

An array containing the command line arguments. The first element will be 'node', the second element will be the name of the JavaScript file. The next elements will be any additional command line arguments.

```javascript
    // print process.argv
    process.argv.forEach(function(val, index, array) {
      console.log(index + ': ' + val);
    });
```

### process.execPath

This is the absolute pathname of the executable that started the process.

### process.execArgv

This is the set of node-specific command line options from the executable that started the process. These options do not show up in process.argv, and do not include the node executable, the name of the script, or any options following the script name. These options are useful in order to spawn child processes with the same execution environment as the parent.

Example:
```node
    $ node --harmony script.js --version
```

results in process.execArgv:
```
    ['--harmony']
```
and process.argv:

```
['/usr/local/bin/node', 'script.js', '--version']
```

### process.chdir(directory)
Changes the current working directory of the process or throws an exception if that fails.

### process.cwd()
Returns the current working directory of the process.

### process.env
An object containing the user environment. See environ(7).

### process.versions
A property exposing version strings of node and its dependencies.
```
console.log(process.versions);
```
Will print something like:

{ http_parser: '1.0',
  node: '0.10.4',
  v8: '3.14.5.8',
  ares: '1.9.0-DEV',
  uv: '0.10.3',
  zlib: '1.2.3',
  modules: '11',
  openssl: '1.0.1e' }

### process.memoryUsage()
Returns an object describing the memory usage of the Node process measured in bytes.
```
var util = require('util');

console.log(util.inspect(process.memoryUsage()));
```
This will generate:
```
{ rss: 4935680,
  heapTotal: 1826816,
  heapUsed: 650472 }
```
heapTotal and heapUsed refer to V8's memory usage.