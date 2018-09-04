/**
 * 接口文档地址
 * author：liuguangrui
 */

const serviceModule = {
  /*查询文章类型*/
  getBingDayPic: '/api/admin/public/getBingDayPic',
  /*新增文章*/
  saveArticle: '/api/admin/article/saveArticle',
  /*新增文章*/
  getFace: '/api/ai/face/get_face'
}
const ApiList = { ...serviceModule }

export default ApiList
