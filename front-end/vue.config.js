const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  devServer: {
    proxy:'http://localhost:3000',
    allowedHosts: 'all',
      client: {
        webSocketURL: 'auto://0.0.0.0:0/ws'
    }
  },
})
