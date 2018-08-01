/**
 * 接口文档地址
 * author：liuguangrui
 */

const serviceModule = {
  /*查询文章类型*/
  getDetail: '/song/detail',
  /*新增文章*/
  getLyric: '/lyric',
  getUrl: '/music/url',
  getSearch: '/search',
}
const ApiList = { ...serviceModule }

export default ApiList