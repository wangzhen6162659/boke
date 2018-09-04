import store from './../store'
import fecth from './fecth'

export default {
  setTitle(title){
    document.title = title
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
