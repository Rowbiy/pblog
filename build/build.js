'use strict'
require('./check-versions')()
// linux 命令
const shell = require('shelljs')

// ora,可以在终端显示spinner
const ora = require('ora')

const path = require('path')
// chalk，用于在控制台输出带颜色的字体
const chalk = require('chalk')

const webpack = require('webpack')
const config = require('../config')
const webpackConfig = require('./webpack.prd.conf')

const spinner = ora('building for ' + process.env.NODE_ENV + '...')
// 控制是否打印废弃警告
process.noDeprecation = true
// 开启loading动画

spinner.start()

// dist根目录
var distPath = config.deploy.assetsRoot
// 静态资源目录
var staticPath = path.join(distPath, config.deploy.assetsSubDirectory)
// 服务器环境配置文件目录
var serverDirectory = path.join(distPath, 'server')
// 首先将整个dist文件夹以及里面的内容删除
shell.rm('-rf', distPath)
// 创建文件夹
shell.mkdir('-p', staticPath)
shell.mkdir('-p', serverDirectory)
// 屏蔽拷贝信息
shell.config.silent = true
shell.cp('-R', 'static/*', staticPath)
shell.cp('-R', 'src/server/*', serverDirectory)
shell.mv(serverDirectory + '/app.js', distPath)
shell.cp('-R', 'config', distPath)
// 拷贝express package.json文件
shell.cp('server-package.json', path.join(distPath, 'package.json'))
shell.config.silent = false

webpack(webpackConfig, (err, stats) => {
  spinner.stop()
  if (err) throw err
  process.stdout.write(stats.toString({
    colors: true,
    modules: false,
    children: false, // If you are using ts-loader, setting this to true will make TypeScript errors show up during build.
    chunks: false,
    chunkModules: false
  }) + '\n\n')

  if (stats.hasErrors()) {
    console.log(chalk.red('  Build failed with errors.\n'))
    process.exit(1)
  }

  console.log(chalk.cyan('  Build complete.\n'))
  console.log(chalk.yellow(
    '  Tip: built files are meant to be served over an HTTP server.\n' +
    '  Opening index.html over file:// won\'t work.\n'
  ))
})
