/**
 * 接口文档地址
 * author：liuguangrui
 */

const serviceModule = {
  /*歌曲详情*/
  getDetail: '/song/detail',
  /*歌曲歌词*/
  getLyric: '/lyric',
  /*歌曲url*/
  getUrl: '/song/url',
  /*搜索歌词*/
  getSearch: '/search',
  /*专辑查找*/
  getAlbum: '/album',
  /*歌单详情*/
  getPlaylist: '/playlist/detail',
  /*歌单详情*/
  getCloudMusicUrl: '/playlist/detail',
  /*前十歌单*/
  getTopPlaylist: '/top/playlist?limit=10&order=new'
}
const ApiList = { ...serviceModule }

export default ApiList
