'use strict'
const utils = require('./utils')
const config = require('../config')

const isProduction = process.env.NODE_ENV === 'prd' || process.env.NODE_ENV === 'ci'

module.exports = {
  loaders: utils.cssLoaders({
    // 是否打开source-map
    sourceMap: config.deploy.productionSourceMap,
    // 是否提取样式到单独的文件
    extract: isProduction
  })
}
