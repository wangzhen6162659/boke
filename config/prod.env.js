const system = require('./../build/system')
module.exports = {
  NODE_ENV: '"production"',
  API_ROOT: '"' + system.proxyTable.API_ROOT + '"',//统一内部接口
  API_MUSIC_ROOT: '"' + system.proxyTable.API_ROOT + '"'//网易云api
  // API_ROOT: '"http://123.56.221.77"',//统一内部接口
  // API_MUSIC_ROOT: '"http://123.56.221.77"'//网易云api
}
