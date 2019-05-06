import store from './../store'
import fecth from './fecth'
import wxShare from './wxUtile.js'
var roots = process.env.API_ROOT

export default {
  setTitle(title, router, name){
    // console.log(router.history.current.path)
    if (router.name != name){
      return;
    }
    document.title = title;
    let url = 'https://wzroom.cn/blog/1/articlelist/2/article/359619625057';
    let data = {
      shareTitle: document.title,
      shareUrl: url,
      shareImg: 'https://wzroom.cn/boke/boke_static/defaultImg.jpg',
      shareDesc: '如果你不爱学习，那么我们没办法做朋友'
    }
    wxShare.wxShare(data);
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
