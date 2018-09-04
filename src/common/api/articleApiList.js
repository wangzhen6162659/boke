/**
 * 接口文档地址
 * author：liuguangrui
 */

const serviceModule = {
  /*查询文章类型*/
  findTypeByUser: '/api/admin/article/findTypeByUser',
  /*新增文章*/
  saveArticle: '/api/admin/article/saveArticle',
  saveArticleType: '/api/admin/article/saveArticleType',
  saveReply: '/api/admin/reply/saveReply',
  findReply: '/api/admin/reply/findReply',
  getArticle: '/api/admin/article/getArticle',
  pageByUser: '/api/admin/article/pageByUser',
  deleteArticle: '/api/admin/article/deleteArticle',
  deleteArticleType: '/api/admin/article/deleteArticleType',
}
const ApiList = { ...serviceModule }

export default ApiList
