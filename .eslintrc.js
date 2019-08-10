// https://eslint.org/docs/user-guide/configuring

module.exports = {
  // 一旦配置了root，ESlint停止在父级目录中查找配置文件
  root: true,
  // 想要支持的JS语言选项
  parserOptions: {
    // 解析器
    parser: 'babel-eslint',
    ecmaVersion: 6,
    sourceType: 'module'
  },
  // 代码运行的环境，每个环境都会有一套预定义的全局对象，不同环境可以组合使用
  env: {
    browser: true,
    commonjs: true,
    es6: true,
    jquery: true,
    amd: true
  },
  // 集成推荐的规则
  extends: [
    // https://github.com/vuejs/eslint-plugin-vue#priority-a-essential-error-prevention
    // consider switching to `plugin:vue/strongly-recommended` or `plugin:vue/recommended` for stricter rules.
    'plugin:vue/essential',
    // https://github.com/standard/standard/blob/master/docs/RULES-en.md
    'standard'
  ],
  // 支持第三方插件的规则，插件以eslint-plugin-作为前缀，配置时该前缀可省略
  // 检查vue文件需要eslint-plugin-vue插件
  // required to lint *.vue files
  plugins: ['vue', 'html'],
  // add your custom rules here
  // 启用额外的规则或者覆盖默认的规则
  // 规则级别分别：为"off"(0)关闭、"warn"(1)警告、"error"(2)错误--error触发时，程序退出
  rules: {
    // 关闭'禁用console'规则
    "no-console": "off",
    // 缩进不规范警告，要求缩进为2个空格，默认值为4个空格
    "indent": ["warn", 2, {
      // 设置为1时强制switch语句中case的缩进为2个空格
      "SwitchCase": 1,
      // 分别配置var、let和const的缩进
      "VariableDeclarator": { "var": 2, "let": 2, "const": 2 }
    }],
    // allow async-await
    'generator-star-spacing': 'off',
    // allow debugger during development
    'no-debugger': process.env.NODE_ENV === 'prd' ? 'error' : 'off',
    //规定圆括号内部的空格。规定是否需要在(右边，或者)左边加空格。
    "space-in-parens": [0, "never"]
  }
}
