/**
 * 接口文档地址
 * author：liuguangrui
 */

const serviceModule = {
  /*查询文章类型*/
  getBingDayPic: '/api/admin/public/getBingDayPic',
  /*新增文章*/
  saveArticle: '/api/admin/article/saveArticle',
}
const ApiList = { ...serviceModule }

export default ApiList
