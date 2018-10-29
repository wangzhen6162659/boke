var merge = require('webpack-merge')
var prodEnv = require('./prod.env')
module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  API_ROOT: '"http://192.168.1.124:10000"',//统一内部接口
  API_MUSIC_ROOT: '"http://123.56.221.77"'//网易云api

  // API_ROOT: '"http://wzroom.cn"',//统一内部接口
  // API_MUSIC_ROOT: '"http://wzroom.cn"'//网易云api
})
