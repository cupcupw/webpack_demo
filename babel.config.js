module.exports = {
  presets: [
    // 前置的打包规则，配置规则
    [
      "@babel/preset-env",
      {
        "useBuiltIns": "usage",
        "corejs": {
          "version": 3
        },
      }
    ],
    // 支持vue中的jsx语法
    "@vue/babel-preset-jsx"
  ],
  // 配置插件
  plugins: [
    "@babel/plugin-transform-runtime",
    ['import', {
      libraryName: 'vant',
      libraryDirectory: 'es',
      style: true
    }, 'vant']
  ]
}