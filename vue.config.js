const { GenerateSW } = require("workbox-webpack-plugin");

module.exports = {
  pwa: {
    // configure the workbox plugin
    workboxPluginMode: 'GenerateSW'
  },
  configureWebpack: {
    plugins: [new GenerateSW()]
  }
}
