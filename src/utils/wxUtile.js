import wx from 'weixin-js-sdk'
import fecth from './fecth'
// import store from './../store'
import apiList from '../common/api/publicApiList.js'
var roots = process.env.API_ROOT

function getWxUrl(path) {
  return roots + path;
}

/**
 *分享
 * @param _this
 * @param shareTitle 标题
 * @param shareUrl 链接
 * @param shareImg 图片
 * @param shareDesc 描述
 */
export default {
  wxShare(shareData) {
    // shareUrl = getWxUrl(shareUrl);
    // var cookieWxConfig = fecth.getCookieValue('wxConfig');
    // if (cookieWxConfig != null && cookieWxConfig!= 'undefined' && cookieWxConfig.length > 0){
    //   this.wxConfig(JSON.parse(fecth.getCookieValue('wxConfig')),shareData)
    // }else {
    //   let url = location.href.substring(location.href.indexOf('//') + 2, location.href.length);
    // let url = location.href;
    // let url = 'wzroom.cn/blog/1/articlelist/2/article/359619625057';
    let url = location.href;
      // url = url.substring(url.indexOf('//') + 2, url.length);
      url = location.href.split('#')[0];
      fecth.get(apiList.getWxConfig, {url: url}).then((res) => {
        let dataConfig = res.data;
        // fecth.setCookie('wxConfig',JSON.stringify(dataConfig));
        this.wxConfig(dataConfig, shareData, url)
      })
    // }
  },
  wxConfig(data, shareData, url){
    wx.config({
      debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
      appId: data.appId, // 必填，公众号的唯一标识
      timestamp: data.timestamp, // 必填，生成签名的时间戳
      nonceStr: data.nonceStr, // 必填，生成签名的随机串
      signature: data.signature, // 必填，签名，见附录1
      jsApiList: ['checkJsApi',
        'onMenuShareTimeline','onMenuShareAppMessage','onMenuShareQQ','onMenuShareWeibo','onMenuShareQZone'] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
    });
    wx.checkJsApi({
      jsApiList: ['onMenuShareAppMessage','onMenuShareTimeline'], // 需要检测的JS接口列表，所有JS接口列表见附录2,
      success: function(res) {
        // 以键值对的形式返回，可用的api值true，不可用为false
        // 如：{'checkResult':{'chooseImage':true},'errMsg':'checkJsApi:ok'}
        console.log(res)
      }
    });
    wx.ready(function () {   //需在用户可能点击分享按钮前就先调用
      wx.onMenuShareAppMessage({
        title: shareData.shareTitle, // 分享标题
        desc: shareData.shareDesc, // 分享描述
        link: url, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致 this.$router.history.current.path
        imgUrl: shareData.shareImg, // 分享图标
      }, function (res) {
        //这里是回调函数
        alert('分享成功');
      });
      wx.onMenuShareTimeline({
        title: shareData.shareTitle, // 分享标题
        desc: shareData.shareDesc, // 分享描述
        link: url, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致 this.$router.history.current.path
        imgUrl: shareData.shareImg, // 分享图标
        success: function () {
          // 用户点击了分享后执行的回调函数
          alert('分享成功');
        }
      });
    });
  }
}
