var merge = require('webpack-merge')
var prodEnv = require('./prod.env')
module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  API_ROOT: '"http://192.168.1.124:9999"',//统一内部接口
  API_MUSIC_ROOT: '"http://203.195.203.69:3000"'//网易云api
})
