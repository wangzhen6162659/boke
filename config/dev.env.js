var merge = require('webpack-merge')
var prodEnv = require('./prod.env')
const system = require('./../build/system')
module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  API_ROOT: '"' + system.proxyTable.API_ROOT + '"',//统一内部接口
  API_MUSIC_ROOT: '"http://wzroom.cn:3000"',//网易云api
  API_PRIX_ROOT: '"/bkapi"',//api前缀
  MUSIC_API_PRIX_ROOT: '"/musicApi"'
})
