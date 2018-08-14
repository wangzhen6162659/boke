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
  getAlbum: '/album',
  getPlaylist: '/playlist/detail',
  getCloudMusicUrl: '/playlist/detail',
  getTopPlaylist: '/top/playlist?limit=10&order=new'
}
const ApiList = { ...serviceModule }

export default ApiList
