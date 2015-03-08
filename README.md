#node information

[api description](./nodeApi.md)

[了不起的Node.js读书笔记](./smashingNodejs.md)

## npm 

npm镜像： [淘宝镜像](https://registry.npm.taobao.org) [cnpmjs镜像](http://r.cnpmjs.org)

镜像的临时使用：
```
    npm --registry https://registry.npm.taobao.org install connect
```

镜像的持久使用：
```
    npm config **set** registry https://registry.npm.taobao.org
    // 配置后可通过下面方式来验证是否成功
    npm config **get** registry
```
## dependencies vs devDependencies

npm install在安装node模块时，有两种命令参数可以把它们的信息写入package.json文件：**–-save** 和 **–-save-dev**

--save会把依赖包名称添加到package.json文件dependencies键下，--save-dev则添加到package.json文件devDependencies键下

默认npm install会同时安装package文件中的dependencies和devDependencies，因为devDependencies只用于开发阶段完成集成测试等功能模块依赖;因此对于生产环境只需要使用npm install –-production安装必须的依赖模块即可

