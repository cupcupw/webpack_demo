const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const { VueLoaderPlugin } = require('vue-loader')

module.exports = {
  mode:"development",
  entry: {
    main:'./src/main.js'
  },
  output: {
    path: path.resolve(__dirname , '../dist'),
    filename: 'js/chunk-[contenthash].js',
    publicPath: process.env.NODE_ENV === "production" ? "./" : "/h5-static/member-compliance/",
    clean: true
  },
  resolve: {
    // 路径别名2
    alias: {
      '@': path.resolve('./src'),
      'src': path.resolve('./src'),
      assets: '~/assets',
    },
    // 引入文件时省略后缀
    extensions: ['.js', '.ts', '.less', '.vue'],
  },
  module:{
    rules:[
      {
        test: /\.(png|jpe?g|gif|svg|webp)$/,
        type: 'asset',
        parser: {
          // 转base64的条件
          dataUrlCondition: {
            maxSize: 25 * 1024, // 25kb
          }
        },
        generator: {
          // 打包到 dist/image 文件下
          filename: 'images/[contenthash][ext][query]',
        },
      },
      {
        test:/\.js$/,
        // 排除node_modules中的js
        include: [
          path.resolve(__dirname, '../node_modules/as-cocoon'),
          path.resolve(__dirname, '../src')
        ],
        // exclude: /node_modules/,
        use: [
          'babel-loader'
        ],
      },
      {
        test: /\.vue$/,
        use: [
          {
            loader: 'vue-loader',
            options: {
              hotReload: true // 关闭热重载
            }
          }
        ],
      }
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './public/index.html',
      filename: 'index.html',
      inject: 'body',
    }),

    //处理vue文件
    new VueLoaderPlugin()
  ]
}
