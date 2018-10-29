import store from './../store'
import fecth from './fecth'
import wxShare from './wxUtile.js'

export default {
  setTitle(title){
    document.title = title
    let data = {
      shareTitle: document.title,
      shareUrl: window.location.href,
      shareImg: 'http://123.56.221.77/static/defaultImg.jpg',
      shareDesc: ''
    }
    wxShare.wxShare(data.shareTitle, data.shareUrl, data.shareImg, data.shareDesc);
    // let titil =
    // let url = window.location.href
    // let desc = ''
    // let img =
    // store.dispatch({
    //   type: 'getShareInfo',
    //   data: {}
    // })

  },
  getEmpId(obj){
    var empId = '';
    if (obj.params.empId != undefined){
      empId = obj.params.empId
      store.dispatch({
        type: 'set_EmpInfo',
        data: obj.params.empId
      })
    } else {
      empId = store.getters.getEmpInfo;
    }
    return empId;
  },
  //判断用户是查看自己页面
  isUserManager(empId) {
    if (fecth.getCookieValue("_user") != '') {
      var user = JSON.parse(fecth.getCookieValue("_user"));
      if (user != null && empId == user.id){
        return true;
      }
    }
    return false;
  },
  //判断用户是否登录
  isLogin() {
    if (fecth.getCookieValue("_user") != ''){
      return true;
    }
    return false;
  }
}
