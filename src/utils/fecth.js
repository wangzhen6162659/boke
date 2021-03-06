import axios from 'axios'
import qs from 'qs'
import store from './../store'
import DGlobal from 'common/js/global.js'

// request拦截器
var roots = process.env.API_ROOT
var rootMusics = process.env.API_MUSIC_ROOT
var apiPrix = process.env.API_PRIX_ROOT
var musicApiPrix = process.env.MUSIC_API_PRIX_ROOT
axios.interceptors.request.use(
  config => {
  // loading
  // console.log('loadding')
   store.dispatch({
    type: 'set_ShowLoading',
    data: true
  })
  return config
}, error => {
  // Do something with request error
  console.log(error) // for debug
  return Promise.reject(error)
})

// respone拦截器
axios.interceptors.response.use(response => {
  return response
}, error => {
  return Promise.resolve(error.response)
})
function checkStatus (response) {
  // loading
  // 如果http状态码正常，则直接返回数据
  if (response && (response.status === 200 || response.status === 304 || response.status === 400)) {
    return response
    // 如果不需要除了data之外的数据，可以直接 return response.data
  }
   store.dispatch({
    type: 'set_ShowLoading',
    data: false
  })

  if (!store.getters.userInfo) {
    const userInfo = DGlobal.storage.getCookie('c_user_info')
  }

  // 异常状态下，把错误信息返回去
  return {
    status: -404,
    msg: '网络异常'
  }
}

function checkCode (res) {
  // 如果code异常(这里已经包括网络错误，服务器错误，后端抛出的错误)，可以弹出一个错误提示，告诉用户
  if (res.status === -404) {
    console.log(res.msg)
  }
  if (res.data && (!res.data.success)) {
    // alert(res.data.error_msg)
  }
  // console.log('loadding')
   store.dispatch({
    type: 'set_ShowLoading',
    data: false
  })
  return res
}

export default {
  setCookie (cname, cvalue, exdays) {
    var d = new Date();
    // d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
    d.setTime(d.getTime() + 30 * 60 * 1000)
    var expires = "expires=" + d.toUTCString();
    document.cookie = cname + "=" + cvalue + "; " + expires;
  },
  getCookieValue(name){
    var name = escape(name);
    //读cookie属性，这将返回文档的所有cookie
    var allcookies = document.cookie;
    //查找名为name的cookie的开始位置
    name += "=";
    var pos = allcookies.indexOf(name);
    //如果找到了具有该名字的cookie，那么提取并使用它的值
    if (pos != -1){    //如果pos值为-1则说明搜索"version="失败
      var start = pos + name.length;   //cookie值开始的位置
      var end = allcookies.indexOf(";",start); //从cookie值开始的位置起搜索第一个";"的位置,即cookie值结尾的位置
      if (end == -1) end = allcookies.length; //如果end值为-1说明cookie列表里只有一个cookie
      var value = allcookies.substring(start,end);  //提取cookie的值
      return decodeURI(value);       //对它解码
    }
    else return "";    //搜索失败，返回空字符串
  },
  post (url, data) {
    url = roots + apiPrix + url;
    var token = this.getCookieValue("_token")
    return axios({
      method: 'post',
      baseURL: process.env.BASE_API,
      url,
      data: qs.stringify(data),
      timeout: 15000,
      headers: {
        'token': token,
        // 'X-Requested-With': 'XMLHttpRequest',
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
      }
    }).then(
      (response) => {
        return checkStatus(response)
      }
    ).then(
      (res) => {
        return checkCode(res)
      }
    )
  },
  postJson (url, data) {
    url = roots + apiPrix + url;
    var token = this.getCookieValue("_token")
    return axios({
      method: 'post',
      baseURL: process.env.BASE_API,
      url,
      data: data,
      timeout: 15000,
      headers: {
        'token': token,
        // 'X-Requested-With': 'XMLHttpRequest',
        'Content-Type': 'application/json; charset=UTF-8'
      }
    }).then(
      (response) => {
        return checkStatus(response)
      }
    ).then(
      (res) => {
        return checkCode(res)
      }
    )
  },
  upload (url, data) {
    url = roots + apiPrix + url;
    var token = this.getCookieValue("_token")
    return axios({
      method: 'post',
      // baseURL: process.env.BASE_API,
      url,
      data,
      timeout: 0,
      headers: {
        // 'X-Requested-With': 'XMLHttpRequest',
        'token': token,
        'Content-Type': 'multipart/form-data'
      }
    }).then(
      (response) => {
        return checkStatus(response)
      }
    ).then(
      (res) => {
        return checkCode(res)
      }
    )
  },

  get (url, params) {
    url = roots + apiPrix + url;
    var token = this.getCookieValue("_token")
    return axios({
      method: 'get',
      baseURL: process.env.BASE_API,
      url,
      params, // get 请求时带的参数
      timeout: 15000,
      headers: {
        'token': token
      }
    }).then(
      (response) => {
        return checkStatus(response)
      }
    ).then(
      (res) => {
        return checkCode(res)
      }
    )
  },
  getOut (url,params) {
    url = rootMusics + musicApiPrix + url;
    return axios({
      method: 'get',
      baseURL: '',
      url,
      params, // get 请求时带的参数
      timeout: 15000
    }).then(
      (response) => {
        return checkStatus(response)
      }
    ).then(
      (res) => {
        return checkCode(res)
      }
    )
  },
  getBase (url,params) {
    return axios({
      method: 'get',
      baseURL: '',
      url,
      params, // get 请求时带的参数
      timeout: 15000
    }).then(
      (response) => {
        return checkStatus(response)
      }
    ).then(
      (res) => {
        return checkCode(res)
      }
    )
  },
  getOutProxy (url,params) {
    var ip = this.createIp();
    // const crypto = require('crypto');

    // let timestamp = parseInt(new Date().getTime()/1000);
    // // 新用户更换orderno,secret
    // let orderno = 'GB20180807092230scdJO9ec';
    // let secret = '6f595097f1c4d24c0c93aaa85b73e6c4';
    //
    // let txt = 'orderno='+orderno+',secret='+secret+',timestamp='+timestamp;
    // let md5 = crypto.createHash('md5');
    // md5.update(txt);
    // let sign = md5.digest('hex');
    // sign = sign.toUpperCase();

    url = rootMusics + url;
    return axios({
      method: 'get',
      // proxy: "http://dynamic.xiongmaodaili.com:8088",
      headers: {
        'x-forwarded-for': ip,
        //  'Proxy-Client-IP': ip,
        'WL-Proxy-Client-IP': ip
      },
      baseURL: process.env.BASE_API,
      url,
      params, // get 请求时带的参数
      timeout: 15000
    }).then(
      (response) => {
        return checkStatus(response)
      }
    ).then(
      (res) => {
        return checkCode(res)
      }
    )
  },
  createIp() {
  var a = Math.round(Math.random() * 250) + 1,
    b = Math.round(Math.random() * 250) + 1,
    c = Math.round(Math.random() * 240) + 1,
    d = Math.round(Math.random() * 240) + 1;
  return [a, b, c, d].join('.');
  },
  getWhithHeaders (url, params) {
    url = roots + apiPrix + url;
    return axios({
      method: 'get',
      baseURL: process.env.BASE_API,
      url,
      params, // get 请求时带的参数
      timeout: 15000,
      headers: {
        'X-Forwarded-For': params.ip
      }
    }).then(
      (response) => {
        return checkStatus(response)
      }
    ).then(
      (res) => {
        return checkCode(res)
      }
    )
  }
}
