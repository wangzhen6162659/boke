/**
 * 接口文档地址
 * author：liuguangrui
 */

const serviceModule = {
  /*歌曲详情*/
  getDetail: '/musicApi/song/detail',
  /*歌曲歌词*/
  getLyric: '/musicApi/lyric',
  /*歌曲url*/
  getUrl: '/musicApi/song/url',
  /*搜索歌词*/
  getSearch: '/musicApi/search',
  /*专辑查找*/
  getAlbum: '/musicApi/album',
  /*歌单详情*/
  getPlaylist: '/musicApi/playlist/detail',
  /*歌单详情*/
  getCloudMusicUrl: '/musicApi/playlist/detail',
  /*前十歌单*/
  getTopPlaylist: '/musicApi/top/playlist?limit=10&order=new'
}
const ApiList = { ...serviceModule }

export default ApiList
