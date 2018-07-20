/**
 * 接口文档地址
 * author：liuguangrui
 */

const serviceModule = {
  /*查询文章类型*/
  findPicture: '/api/admin/album/findPicture',
  /*新增文章*/
  getByIndex: '/api/admin/album/getByIndex',
  getBingDayPic: '/api/admin/public/getBingDayPic',
}
const ApiList = { ...serviceModule }

export default ApiList
