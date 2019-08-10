const shell = require('shelljs')
const path = require('path')
const log4js = require('log4js')
const express = require('express')
const bodyParser = require('body-parser')
// 压缩请求
const compress = require('compression')

// 获取配置
const configFile = process.env.NODE_ENV === 'dev' ? '../../config' : './config'
const config = require(configFile)

// express中间件，将http请求代理到其他服务器
const proxyMiddleware = require('http-proxy-middleware')

// Define HTTP proxies to your custom API backend
// 定义HTTP代理，到自定义API接口
const proxyTable = config.deploy.proxyTable

const app = express()

// 日志输出路径自动创建
const logPath = config.deploy.logPath
console.log('logPath', logPath)
shell.mkdir('-p', logPath)

// 日志格式配置
log4js.configure(config.deploy.log)
var dateFileLog = log4js.getLogger('dateFileLog')
// 页面请求日志,用auto的话,默认级别是WARN
app.use(log4js.connectLogger(dateFileLog, {level: 'debug', format: ':method :url', nolog: '\\.gif|\\.jpg|\\.png|\\.svg|\\.mp3|\\.js'}))


app.use(bodyParser.json({limit: 3 * 1024 + 'kb'}))
app.use(bodyParser.urlencoded({
  extended: true,
  limit: 3 * 1024 + 'kb'
}))

app.use(express.query())
app.use(compress())

// posix属性提供了对路径方法的POSIX特定实现的访问。
// 服务纯静态资源。 利用Express托管静态文件，使其可以作为资源访问
// 想要访问static文件夹下的资源，必须添加 staticPath 返回的地址作为上一级地址。
var staticPath = path.posix.join(config.deploy.assetsPublicPath, config.deploy.assetsSubDirectory)
app.use(staticPath, express.static('./static'))


// 将proxyTable中的代理请求配置挂在express服务器上
Object.keys(proxyTable).forEach(function (context) {
  var options = proxyTable[context]
  if (typeof options === 'string') {
    options = {target: options}
  }
  app.use(proxyMiddleware(options.filter || context, options))
})

// 处理 HTML5历史api回退的问题
// handle fallback for HTML5 history API
app.use(require('connect-history-api-fallback')())

// 非开发环境，输出静态文件
if (process.env.NODE_ENV !== 'dev') {
  app.use("/", function (req, res) {
    res.sendFile(path.join(__dirname, '../index.html'))
  })
  var port = config.deploy.port
  var uri = 'http://localhost:' + port
  app.listen(port, function (err) {
    if (err) {
      console.log(err)
      return
    }
    console.log('> Listening at ' + uri + '\n')
  })
}

module.exports = app
