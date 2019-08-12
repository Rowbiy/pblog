// 调用check-versions.js 模块，检查版本node和npm的版本
require('./check-versions')()
process.env.NODE_ENV = 'dev'
// 引入express服务器
const expressApp = require('../src/server/app')

// 获取配置
var config = require('../config')

// opn模块
var opn = require('open')

var webpack = require('webpack')

var webpackConfig = process.env.NODE_ENV === 'prd'
  ? require('./webpack.prd.conf')
  : require('./webpack.dev.conf')

var port = config.deploy.port

// automatically open browser, if not set will be false
var autoOpenBrowser = !!config.deploy.autoOpenBrowser

// 根据webpack配置文件创建Compiler对象
var compiler = webpack(webpackConfig)


/**
 * 引入webpack开发中间件, 此插件只在开发环境中有用。
 * 使用compiler对象来对相应的文件进行编译和绑定
 * 编译绑定后将得到的产物存放在内存中而没有写进磁盘
 * 将这个中间件交给express使用之后即可访问这些编译后的产品文件
 */
var devMiddleware = require('webpack-dev-middleware')(compiler, {
  // 绑定中间件到publicPath中，使用方法和在webpack中相同
  publicPath: webpackConfig.output.publicPath,
  // 允许在console控制台显示 警告 和 错误 信息
  quiet: true
})
/**
 * 引入热重载功能的中间件
 * Webpack热重载仅使用webpack-dev-middleware开发中间件
 * 这个中间件，允许您在没有webpack-dev-server的情况下
 * 将热重载功能到现有服务器中
 */
var hotMiddleware = require('webpack-hot-middleware')(compiler, {
  log: () => {
  }
})

// 当html-webpack-plugin提交之后通过热重载中间件发布重载动作使得页面重载
// force page reload when html-webpack-plugin template changes
compiler.plugin('compilation', function (compilation) {
  compilation.plugin('html-webpack-plugin-after-emit', function (data, cb) {
    hotMiddleware.publish({action: 'reload'})
    cb()
  })
})


// 为webpack打包输出服务
// serve webpack bundle output
expressApp.use(devMiddleware)


// 热重载和状态保留功能
// 显示编译错误信息
// enable hot-reload and state-preserving
// compilation error display
expressApp.use(hotMiddleware)


var uri = 'http://localhost:' + port

devMiddleware.waitUntilValid(function () {
  expressApp.listen(port, function (err) {
    if (err) {
      console.log(err)
      return
    }
    // when env is ci, don't need open it
    if (autoOpenBrowser && process.env.NODE_ENV !== 'ci') {
      opn(uri)
    }
    console.log('> Listening at ' + uri + '\n')
  })
})

