/**
 * 接口文档地址
 * author：liuguangrui
 */

const serviceModule = {
  /*查询文章类型*/
  findTypeByUser: '/admin/article/findTypeByUser',
  /*新增文章*/
  saveArticle: '/admin/article/saveArticle',
  saveArticleType: '/admin/article/saveArticleType',
  saveReply: '/admin/reply/saveReply',
  findReply: '/admin/reply/findReply',
  getArticle: '/admin/article/getArticle',
  pageByUser: '/admin/article/pageByUser',
  deleteArticle: '/admin/article/deleteArticle',
  deleteArticleType: '/admin/article/deleteArticleType',
}
const ApiList = { ...serviceModule }

export default ApiList
