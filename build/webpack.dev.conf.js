'use strict'
const utils = require('./utils')
const webpack = require('webpack')
const config = require('../config')
const merge = require('webpack-merge')

const baseWebpackConfig = require('./webpack.base.conf')

// html-webpack-plugin用于将webpack编译打包后的产品文件注入到html模板中
// 即自动在index.html里面加上<link>和<script>标签引用webpack打包后的文件
const HtmlWebpackPlugin = require('html-webpack-plugin')
// 用于更友好地输出webpack的警告、错误等信息
const FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin')

// add hot-reload related code to entry chunks
Object.keys(baseWebpackConfig.entry).forEach(function (name) {
  baseWebpackConfig.entry[name] = ['./build/dev-client'].concat(baseWebpackConfig.entry[name])
})


const devWebpackConfig = merge(baseWebpackConfig, {
  module: {
    // 样式文件的处理规则，对css/sass/scss等不同内容使用相应的styleLoaders
    // 由utils配置出各种类型的预处理语言所需要使用的loader，例如sass需要使用sass-loader
    rules: utils.styleLoaders({ sourceMap: config.deploy.productionSourceMap})
  },
  // 使用这种source-map更快
  devtool: '#cheap-module-eval-source-map',
  // webpack插件
  plugins: [
    // 开启webpack热更新功能
    new webpack.HotModuleReplacementPlugin(),
    // HMR shows correct file names in console on update.
    new webpack.NamedModulesPlugin(),
    // webpack编译过程中出错的时候跳过报错阶段，不会阻塞编译，在编译结束后报错
    new webpack.NoEmitOnErrorsPlugin(),
    // 自动将依赖注入html模板，并输出最终的html文件到目标文件夹
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: 'index.html',
      inject: true
    }),
    new FriendlyErrorsPlugin()
  ]
})

module.exports = devWebpackConfig
