/**
 * 接口文档地址
 * author：liuguangrui
 */

const serviceModule = {
  /*查询文章类型*/
  getBingDayPic: '/admin/public/getBingDayPic',
  /*新增文章*/
  saveArticle: '/admin/article/saveArticle',
  /*新增文章*/
  getFace: '/ai/face/get_face',
  /*新增文章*/
  getWxConfig: '/admin/public/getWxConfig'
}
const ApiList = { ...serviceModule }

export default ApiList
