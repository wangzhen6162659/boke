<template>
  <div id="app" @resize="isApp">
    <div @click="setPlay" v-if="isVisiableModal" class="visiable">您的浏览器是chrome, 需要点此才可完成可视化播放</div>
    <loader :isshow="getShowLoading" loaderbackground="rgba(0,0,0,0.3)"></loader>
    <div class="maincontent">
      <fixed-bg v-if="imageInfo.url && imageSetting" :imagepath="imageInfo.url" />
      <!--<fixed-bg :imagepath="imageInfo.url" />-->
      <!--<img src="http://192.168.1.124:6080/file/xiaojiejie.jpg"/>-->
    </div>
    <v-content></v-content>
    <updatetips :defaultvalue="getVersionList"></updatetips>
    <!--<musicCanvas></musicCanvas>-->
    <audio :src="getCurrentMusic.url" ref="myAudio" crossorigin="anonymous">凉了</audio>
  </div>
</template>
<script>
// import axios from 'axios'
import store from 'store'
import fecth from 'utils/fecth.js'
import apiPublicList from 'common/api/publicApiList.js'
import musicApi from 'components/music/music.js'
import apiAblumList from 'common/api/albumApiList.js'
import home from 'components/home.vue'
import fixedbg from 'components/common/fixedbg/fixedbg.vue'
import content from 'components/common/content/content.vue'
import pic from 'components/pic/pic.vue'
import loader from 'components/common/loader/loader.vue'
import updatetips from 'components/common/updatetips/updatetips.vue'
import DGlobal from 'common/js/global.js'
// 引入背景请求的api
import {getBingInfo, getMineBgByIndex} from 'common/api/background.js'
// import $ from 'jquery'
export default {
  data () {
    return {
      isgetimagebybing: store.getters.getShowBingImage,
      AC: undefined,
      isVisiableModal: false
    }
  },
  name: 'app',
  components: {
    home,
    'v-content': content,
    'fixed-bg': fixedbg,
    pic,
    loader,
    updatetips
  },
  methods: {
    setPlay () {
      this.AC.resume()
      this.isVisiableModal = false
    },
    createAnalyser () {
      if (store.getters.getGlobalInfo.isHigher768) {
        try {
            window.AudioContext = window.AudioContext || window.webkitAudioContext || window.mozAudioContext || window.msAudioContext
            this.AC = new window.AudioContext()
            const analyser = this.AC.createAnalyser()
            const gainnode = this.AC.createGain()
            gainnode.gain.value = 1

            const source = this.AC.createMediaElementSource(this.$refs.myAudio)
            source.connect(analyser)
            analyser.connect(gainnode)
            gainnode.connect(this.AC.destination)
            store.commit('setAnalyser', analyser)
        } catch (err) {
          alert('!Your browser does not support Web Audio API!')
        }
      }
    },
    fetchData () {
      // 是否需要获取壁纸信息
      const isShowBingImage = store.getters.getGlobalInfo.showBingImage
      // api地址
      let api = isShowBingImage ? apiPublicList.getBingDayPic : apiAblumList.getByIndex
      // 判断本地是否有背景设置的数据信息
      const hasFixedImageBg = localStorage.getItem('fixedImageBg')
      // bing 的每日一图
      if (isShowBingImage) {
        getBingInfo(api, 0)
      } else {
        // 自定义图片  默认是我设置的图片
        if ((hasFixedImageBg === null || hasFixedImageBg === '' || JSON.parse(hasFixedImageBg).type === 'bing')) {
           let index = store.getters.getFixedImageInfo.index
           getMineBgByIndex(api, index)
        } else {
          // 背景图片地址设置本地存储
          const getFixedImageBg = JSON.parse(localStorage.getItem('fixedImageBg'))
          let index = store.getters.getFixedImageInfo.index
          // 如果是自定义壁纸 判断有没有最新的壁纸  有就更新 没有就不更新
          if (getFixedImageBg && getFixedImageBg.type === 'home') {
            fecth.get(api, {index: index}).then((res) => {
              if (!(getFixedImageBg === null || '') && res.data.data) {
                // 判断是否和本地数据一样  一样则用本地的数据 不一样则请求最新的数据
                if (getFixedImageBg.url === res.data.data.url) {
                  store.dispatch({
                    type: 'set_FixedImageInfo',
                    data: getFixedImageBg
                  })
                } else {
                  // 否则获取最新的图片信息
                  getMineBgByIndex(api, 0)
                }
              }
            })
          } else {
            // 如果是bing壁纸 判断有没有最新的壁纸  有就更新 没有就不更新
            fecth.post(api, {index: index}).then((res) => {
              if (!(getFixedImageBg === null || '') && res.data) {
                // 判断是否和本地数据一样  一样则用本地的数据 不一样则请求最新的数据
                if (getFixedImageBg.url === res.data.url) {
                  store.dispatch({
                    type: 'set_FixedImageInfo',
                    data: getFixedImageBg
                  })
                } else {
                  // 否则获取最新的图片信息
                  getBingInfo(api, 0)
                }
              }
            })
          }
        }
      }
    },
    getPlace () {
      // fecth.get('http://www.daiwei.org/vue/server/home.php?inAjax=1&do=getAdress').then((res) => {
      //   if (res.data) {
      //     store.dispatch({
      //       type: 'set_Place',
      //       data: res.data.data
      //     })
      //     this.getWeather(res.data.data.city)
      //   }
      // }, (err) => {
      //   alert(err)
      // })
    },
    // 获取天气信息
    getWeather (city) {
      // fecth.post(`http://www.daiwei.org/vue/server/home.php?inAjax=1&do=getWeather`, {place: city}).then((res) => {
      //   try {
      //     store.dispatch({
      //       type: 'set_Weather',
      //       data: res.data.data.forecast
      //     })
      //   } catch (e) {
      //     store.dispatch({
      //       type: 'set_Weather',
      //       data: {}
      //     })
      //   }
      // }, (err) => {
      //   alert(err)
      // })
    },
    isApp () {
      let isTrue = false
      if (document.body.clientWidth < 768) {
        isTrue = false
      } else {
        isTrue = true
      }
      store.commit({
        type: 'setIsHigher768',
        data: isTrue
      })
      // console.log(isTrue)
    },
    shouldLoadingBg () {
      if (window.localStorage) {
        // 全局设置
        const getAllStorage = JSON.parse(localStorage.getItem('globalInfo'))
        if (!(getAllStorage === null || '')) {
          store.dispatch({
            type: 'set_GlobalInfo',
            data: getAllStorage
          })
        }
        // 背景图片地址设置本地存储
        const getFixedImageBg = JSON.parse(localStorage.getItem('fixedImageBg'))
        if (!(getFixedImageBg === null || '')) {
          store.dispatch({
            type: 'set_FixedImageInfo',
            data: getFixedImageBg
          })
        }
        return true
      } else {
        return false
      }
    },
    setAudioRef () {
      store.commit({
        type: 'setAudioEle',
        data: this.$refs.myAudio
      })
    },
    updateLoginInfo () {
      if (DGlobal.storage.getCookie('c_user_info')) {
        DGlobal.storage.setCookie('c_user_info', unescape(DGlobal.storage.getCookie('c_user_info')), 60 * 60 * 1000 * 24)
      }
    }
  },
  watch: {
    getIsBingBg (nowval, oldval) {
      this.fetchData()
      localStorage.setItem('globalInfo', JSON.stringify(store.getters.getGlobalInfo))
    },
    '$route': function () {
      this.updateLoginInfo()
    }
  },
  computed: {
    getGlobalStyle () {
      return store.getters.getGlobalInfo
    },
    imageInfo () {
      return store.getters.getFixedImageInfo
    },
    imageSetting () {
      return store.getters.getFixedBgInfo
    },
    getIsBingBg () {
      return store.getters.getGlobalInfo.showBingImage
    },
    getShowLoading () {
      return store.getters.getShowLoading
    },
    getCurrentMusic () {
      return store.getters.getCurrentAudio
    },
    getVersionList () {
      return store.getters.getVersionList
    },
    isLogin () {
      return store.getters.getUserInfo === null
    }
  },
  mounted () {
    // 输出信息
    DGlobal.utils.setConsole('如果你不爱学习，那么我们没办法做朋友')
    // 设置audio 的refs
    this.setAudioRef()
    // this.$nextTick(() => {
    // 是否在线加载壁纸
    this.shouldLoadingBg()
    // 获取用户地址
    this.getPlace()
    // 是否小于768
    this.isApp()
    // 加载数据
    this.fetchData()
    // 判断是否登录
    this.updateLoginInfo()
    /**
     *  设置音乐分析器
     */

    this.isVisiableModal = navigator.userAgent.toLowerCase().match(/chrome/) && store.getters.getGlobalInfo.isHigher768
    console.log(this.isVisiableModal)
    this.createAnalyser()
    // 挂载 onresize事件
    window.onresize = () => {
      this.isApp()
    }
    localStorage.setItem('globalInfo', JSON.stringify(store.getters.getGlobalInfo))
    // })
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus">
@import '~common/stylus/border-1px/index.styl'
  audio
    display:none
  body,html
    margin:0
    padding:0
    box-sizing:border-box
    background:#f0f0f0f0
    /*user-select:none*/
    -webkit-tap-highlight-color: transparent
  #app
    position: fixed
    top: 0
    left: 0
    bottom: 0
    right:0
    background:transparent
  .visiable
    position: absolute;
    z-index: 1
    top: 80%;
    width: 100%;
    text-align: center;
    text-shadow:0 0 0.2em #48d9f7
</style>
