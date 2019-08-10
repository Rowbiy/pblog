
const path = require('path')

var root = path.normalize(__dirname + '/..')

const envFile = './' + (process.env.NODE_ENV || 'prd') + '.env.js'

console.info('load:', envFile)

var envConfig = require(envFile)

var log = {
  appenders: [{
      // 控制台输出
      type: 'console',
      category: 'console'
    },
    {
      // 日期文件格式
      type: 'dateFile',
      maxLogSize: 20480,
      filename: root + '/logs/access.log',
      pattern: '_yyyy-MM-dd',
      alwaysIncludePattern: false,
      category: 'dateFileLog'
  }],
  // 替换console.log
  replaceConsole: true,
  levels: {
    dateFileLog: 'INFO',
    console: 'DEBUG'
  }
}


module.exports = {
  deploy: {
    index: path.resolve(__dirname, '../dist/index.html'),
    autoOpenBrowser: envConfig.autoOpenBrowser,
    port: envConfig.port,
    proxyTable: envConfig.proxyTable,
    log: log,
    logPath: root + '/logs',
    // 产品文件的存放路径
    assetsRoot: path.resolve(__dirname, '../dist'),
    // 发布路径
    assetsPublicPath: '/',
    // 静态资源文件夹
    assetsSubDirectory: 'static',
    productionSourceMap: envConfig.productionSourceMap,
    // Gzip off by default as many popular static hosts such as
    // Surge or Netlify already gzip all static assets for you.
    // Before setting to `true`, make sure to:
    // npm install --save-dev compression-webpack-plugin
    productionGzip: true,
    productionGzipExtensions: ['js', 'css'],
    useEslint: envConfig.useEslint
  }
}

