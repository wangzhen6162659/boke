/**
 * 接口文档地址
 * author：liuguangrui
 */

const serviceModule = {
  /*查询文章类型*/
  findPicture: '/admin/album/findPicture',
  /*新增文章*/
  getByIndex: '/admin/album/getByIndex',
  getBingDayPic: '/admin/public/getBingDayPic',
}
const ApiList = { ...serviceModule }

export default ApiList
