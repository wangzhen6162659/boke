/**
 * 接口文档地址
 * author：liuguangrui
 */

const serviceModule = {
  /*查询文章类型*/
  get: '/api/admin/user/get',
  /*新增文章*/
  login: '/api/admin/user/login',
  save: '/api/admin/user/save',
  update: '/api/admin/user/update'
}
const ApiList = { ...serviceModule }

export default ApiList
