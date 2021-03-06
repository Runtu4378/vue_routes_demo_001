'use strict'
const webpack = require('webpack')
const ip = require('ip')
const merge = require('webpack-merge')
const path = require('path')
const chalk = require('chalk')
const portfinder = require('portfinder')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin')
const VueLoaderPlugin = require('vue-loader/lib/plugin')

const utils = require('./utils')
const config = require('./config')
const baseWebpackConfig = require('./webpack.base.conf')

const HOST = process.env.HOST
const PORT = process.env.PORT && Number(process.env.PORT)
const PROD_ENV = process.env.PROD_ENV

const devWebpackConfig = merge(baseWebpackConfig, {
  mode: 'development',

  module: {
    rules: [
      ...utils.createStyleLoaders({
        sourceMap: config.dev.cssSourceMap,
        // usePostCSS: true,
      }),
    ],
  },

  // output: {
  //   devtoolLineToLine: { test: /\.js$/, include: 'src' }
  // },

  // cheap-module-eval-source-map is faster for development
  devtool: config.dev.devtool,

  // these devServer options should be customized in /config/index.js
  devServer: {
    clientLogLevel: 'warning',
    historyApiFallback: {
      rewrites: [
        {
          from: /.*/,
          to: path.posix.join(config.dev.assetsPublicPath, 'index.html'),
        },
      ],
    },
    hot: true,
    contentBase: false, // since we use CopyWebpackPlugin.
    compress: true,
    host: HOST || config.dev.host,
    port: PORT || config.dev.port,
    open: config.dev.autoOpenBrowser,
    overlay: config.dev.errorOverlay
      ? { warnings: false, errors: true }
      : false,
    publicPath: config.dev.assetsPublicPath,
    proxy: config.dev.proxyTable,
    quiet: config.dev.errorFriendly, // necessary for FriendlyErrorsPlugin
    watchOptions: {
      poll: config.dev.poll,
    }
  },

  plugins: [
    // 请确保引入这个插件！
    new VueLoaderPlugin(),
    new webpack.DefinePlugin({
      'process.env': require('./config/dev.env'),
      'PUBLIC_PATH': JSON.stringify(config.dev.assetsPublicPath),
    }),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NamedModulesPlugin(), // HMR shows correct file names in console on update.
    new webpack.NoEmitOnErrorsPlugin(),
    // https://github.com/ampedandwired/html-webpack-plugin
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: utils.resolve('./src/index.html'),
      inject: true
    }),
  ]
})

module.exports = new Promise((resolve, reject) => {
  portfinder.basePort = process.env.PORT || config.dev.port
  portfinder.getPort((err, port) => {
    if (err) {
      reject(err)
    } else {
      const myIp = ip.address()
      // publish the new Port, necessary for e2e tests
      process.env.PORT = port
      // add port to devServer config
      devWebpackConfig.devServer.port = port

      const host = devWebpackConfig.devServer.host === '0.0.0.0' ?
        'localhost' :
        devWebpackConfig.devServer.host

      const localUrl = `http://${host}:${port}`
      const localServiceUrl = `http://${myIp}:${port}`

      if (config.dev.errorFriendly) {
        // Add FriendlyErrorsPlugin
        devWebpackConfig.plugins.push(new FriendlyErrorsPlugin({
          compilationSuccessInfo: {
            messages: [`app is running here:
  
  - Local:    ${chalk.blue(localUrl)}
  - Network:  ${chalk.blue(localServiceUrl)}
  `],
          },
          onErrors: config.dev.notifyOnErrors
          ? utils.createNotifierCallback()
          : undefined
        }))
      }

      resolve(devWebpackConfig)
    }
  })
})
