//开发环境
const { merge } = require('webpack-merge')
const base = require('./webpack.base')
const webpack = require('webpack')
const {resolve} = require("path");
//配置反代理
module.exports = merge(base, {
  target: 'web',
  mode: 'development',
  devtool: 'eval-cheap-module-source-map',//开发时报错可以看到源码映射 不要用在生产上
  // loader 配置
  module: {
    rules: [
      // css 样式
      {
        test: /\.css$/,
        use: [
          'style-loader',
          'css-loader',
        ],
      },
      // sass 样式
      {
        test: /\.s(c|a)ss$/,
        use: [
          'style-loader',
          'css-loader',
          'sass-loader',
        ],
      },
    ],
  },
  devServer: {
    // 运行的目录
    contentBase: resolve(__dirname, '../public/'),
    host: '0.0.0.0',
    useLocalIp: true,
    // 启动 gzip 压缩
    compress: true,
    // 服务端口
    port: 443,
    https:true,
    // port: 9527,
    // 自动打开浏览器
    disableHostCheck: true,
    open: true,
    // 开启 hot
    hot: true,
    proxy:{
      '/api': {     //这里最好有一个 /
        target: 'https://app.autostreets.com/',  // 后台接口域名
        ws: true,        //如果要代理 websockets，配置这个参数
        secure: false,  // 如果是https接口，需要配置这个参数
        changeOrigin: true,  //是否跨域
        pathRewrite:{
          '^/api': ''
        }
      },
    }
  },
})
