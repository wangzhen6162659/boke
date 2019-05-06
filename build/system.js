var systemName = 'boke/boke'
module.exports = {
  // 此处是开发的项目的简称，需要找后端进行确认，便于后端nginx代理返回静态资源，最后访问的html的地址将变为http://localhost:8080/cloud-first/index.html
  name: systemName,
  // 静态资源最后打包的文件夹名称，也就是static文件夹下的文件最后打包的文件夹名称，默认 项目名称_static
  assetsSubDirectory: systemName + '_static',
  assetsIndexDirectory: systemName + '_webapp',
  // 配置代理，便于本地开发过程中可以连到任意的地址进行调试，可以按照规则配置多个代理地址
  proxyTable: {
      API_ROOT: 'https://wzroom.cn'
    }
  }
