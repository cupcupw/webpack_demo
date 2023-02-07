// 生产环境
const { merge } = require('webpack-merge')
const base = require('./webpack.base')
const webpack = require('webpack')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const CopyPlugin = require("copy-webpack-plugin")
const { resolve } = require('path');

module.exports = merge(base, {
  mode: 'production',
  devtool: 'nosources-source-map',//开发时报错不能看到源码映射
  // loader 配置
  module: {
    rules: [
      {
        test: /\.(css|s[ca]ss)$/,
        use:[
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              publicPath: '../',
            }
          },
          'css-loader',
          'sass-loader',
        ]
      },
    ],
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: 'styles/chunk-[contenthash].css',
      // ignoreOrder: true,
    }),
    new CopyPlugin({
      patterns: [
        {
          // 定义要拷贝的源目录
          from: resolve(__dirname, '../public/static'),
          // 定义要拷贝到的目标目录
          to: resolve(__dirname, '../dist/static'),
        },
        {
          // 定义要拷贝的源目录
          from: resolve(__dirname, '../public/favicon.ico'),
          // 定义要拷贝到的目标目录
          to: resolve(__dirname, '../dist/favicon.ico'),
        },
      ],
    })
  ]
})
