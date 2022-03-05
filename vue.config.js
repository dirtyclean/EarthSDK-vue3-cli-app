// vue.config.js
const CopyWebpackPlugin = require('copy-webpack-plugin')

module.exports = {
  configureWebpack: config => {
    const cwp = new CopyWebpackPlugin({
      patterns: [
        {
          from: './node_modules/earthsdk/dist/XbsjCesium',
          to: 'js/earthsdk/XbsjCesium',
          toType: 'dir'
        },
        {
          from: './node_modules/earthsdk/dist/XbsjEarth',
          to: 'js/earthsdk/XbsjEarth',
          toType: 'dir'
        }
      ]
    })
    config.plugins.push(cwp)
  },
  devServer: {
    port: 8081,
    open: false,
    // 让浏览器 overlay 同时显示eslint的警告和错误
    overlay: {
      warnings: false,
      errors: false
    },
    proxy: {
      '/pc': {
        target: 'https://hcs-fxyp-dht.scdem.cn',
        changeOrigin: true,
        ws: true
      }
    }
  }
}
