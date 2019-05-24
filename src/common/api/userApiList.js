/**
 * 接口文档地址
 * author：liuguangrui
 */

const serviceModule = {
  /*查询文章类型*/
  get: '/admin/user/get',
  /*新增文章*/
  login: '/admin/user/login',
  save: '/admin/user/save',
  update: '/admin/user/update'
}
const ApiList = { ...serviceModule }

export default ApiList
