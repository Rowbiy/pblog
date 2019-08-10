
module.exports = {
  // 是否自动打开浏览器
  'autoOpenBrowser': true,
  // 监听的端口
  'port': 8080,
  // 代理配置表，在这里可以配置特定的请求代理到对应的API接口
  // 例如将'localhost:8080/api/xxx'代理到'www.example.com/api/xxx'
  'proxyTable': {
    '/prefix': {
      'target': 'http://172.31.4.246:8080/',
      // 'target': 'http://172.31.51.38:8080/',
      'changeOrigin': true,
      'pathRewrite': {
        '^/prefix': 'tom'
      }
    }
  },
  // 开启eslint校验
  'useEslint': true,
  'productionSourceMap': true
}
