<template>
  <section class="div_content">
    <ul class="ul-header border-1px">
      <!-- pc 页面菜单 -->
      <div class="left-menu" v-show="getGlobalInfo.isHigher768">
          <!--<router-link class="logo" tag="a" to="/home">-->
            <!--<img width="36" height="36" src="http://www.daiwei.org/new/dw.png" title="未曾遗忘的青春 | 萌芽 - web前端_技术分享_戴伟的个人网站" alt="">-->
          <!--</router-link>-->
          <router-link tag="a" :to="'/home/'+getUserId">
            <li>首页</li>
          </router-link>
          <!--<a href="http://www.daiwei.org/blog" target="_black">-->
          <router-link tag="a" :to="'/blog/'+getUserId">
            <li>博客</li>
          </router-link>
          <!--</a>-->
          <!--<router-link tag="a" to="/pic">-->
            <!--<li>状态</li>-->
          <!--</router-link>-->
          <router-link tag="a" :to="'/music/'+getUserId">
            <li>音乐</li>
          </router-link>
          <!--<router-link tag="a" to="/about">-->
            <!--<li>关于</li>-->
          <!--</router-link>-->
          <!--<router-link tag="a" to="/reward">-->
            <!--<li>-->
              <!--<span class="icon-reward" style="font-size: 16px;vertical-align:middle"></span>-->
              <!--打赏-->
            <!--</li>-->
          <!--</router-link>-->
        </div>
        <!-- 移动端菜单按钮 -->
        <transition name="fade">
          <div class="fixed-fade-menu" ref="fixed_menu" :class="{ios: isIos}" v-show="showLeftMenu" @click="hideLeftContent">
            <div class="fixed-menu-content" @click="hideLeftContent">
              <router-link tag="a" :to="'/home/'+getUserId">
                <li>首页</li>
              </router-link>
              <!--<a href="http://www.daiwei.org/blog" target="_black">-->
              <router-link tag="a" :to="'/blog/'+getUserId">
                <li>博客</li>
              </router-link>
              <!--</a>-->
              <!--<router-link tag="a" to="/pic">-->
                <!--<li>状态</li>-->
              <!--</router-link>-->
              <router-link tag="a" :to="'/music/'+getUserId">
                <li>音乐</li>
              </router-link>
              <!--<router-link tag="a" to="/about">-->
                <!--<li>关于</li>-->
              <!--</router-link>-->
              <!--<router-link tag="a" to="/reward">-->
                <!--<li>-->
                  <!--<span class="icon-reward" style="font-size: 16px;vertical-align:middle"></span>-->
                  <!--打赏-->
                <!--</li>-->
              <!--</router-link>-->
            </div>
          </div>
        </transition>
      </div>
      <div class="fixed-menu" v-show="!getGlobalInfo.isHigher768" @click="toggleMenuContent">
        <i class="icon-menu"></i>
      </div>
      <!-- pc 移动端设置按钮 -->
      <div class="right-menu">
        <!-- <span class="place listmenu" v-show="getPlace.region" :data-place="getPlace.region" @mouseover="showWeatherInfo" @mouseleave="hideWeatherInfo">
          {{getPlace.city}}
          <weather :isShow="showWeatherList"></weather>
        </span> -->
        <router-link v-if="userInfo !== null" class="listmenu" tag="a" :to="'/user/'+getUserId+'/info'">
          {{userInfo.nickname === '' ? (userInfo.username === '' ? '点击设置用户名' : userInfo.username) : userInfo.nickname}}
        </router-link>

        <router-link v-else class="listmenu" tag="a" to="/user/login/-1">
          登陆
        </router-link>

        <router-link v-if="userInfo !== null" tag="a" :to="'/home/'+userInfo.id" class="a-icon">
          <li class="li-icon" title="我的主页" @click="hideLeftContent"><i class="iconfont iconali-gerenzhongxin"></i></li>
        </router-link>

        <!--<a href="https://www.github.com/ifmiss/vue-website" target="_black">-->
          <!--<li class="li-icon" title="github"><i class="icon-github"></i></li>-->
        <!--</a>-->

        <router-link tag="a" to="/setting" class="a-icon">
          <li class="li-icon" title="设置" @click="hideLeftContent"><i class="icon-setting"></i></li>
        </router-link>
      </div>
    </ul>
    <transition name="fade">
      <keep-alive>
        <router-view class="li_list"></router-view>
      </keep-alive>
    </transition>
  </section>
</template>
<script>
import store from 'store'
import bus from 'utils/bus.js'
import weather from 'components/common/weather/weather.vue'
import fecth from 'utils/fecth.js'
let t
export default {
  data () {
    return {
      showLeftMenu: false,
      showWeatherList: false,
      userInfo: null,
      empId: this.$route.params.empId,
      user: {
        id: '',
        nickname: '',
        photo: '',
        selfLable: [],
        sex: ''
      }
    }
  },
  methods: {
    toggleMenuContent () {
      this.showLeftMenu = !this.showLeftMenu
    },
    hideLeftContent () {
      this.showLeftMenu = false
    },
    // 显示天气信息
    showWeatherInfo () {
        clearTimeout(t)
        this.showWeatherList = true
    },
    // 隐藏天气信息
    hideWeatherInfo () {
      const _that = this
      t = setTimeout(function () {
          _that.showWeatherList = false
      }, 800)
    },
    setUserInfo () {
      if (fecth.getCookieValue("_user") != ''){
        this.userInfo = JSON.parse(fecth.getCookieValue("_user"));
        this.userInfo.nickname = decodeURI(this.userInfo.nickname);
      } else {
        this.userInfo = null;
      }
    },
    setEmpInfo () {
      if(this.$route.params.empId !=undefined){
        store.dispatch({
          type: 'set_EmpInfo',
          data: this.$route.params.empId
        })
      } else if(store.getters.getEmpInfo != null){
        store.dispatch({
          type: 'set_EmpInfo',
          data: store.getters.getEmpInfo
        })
      }
    }
    // getRightWendu (l, h) {
    //   return l.split(' ')[l.split(' ').length - 1] + ' ~ ' + h.split(' ')[l.split(' ').length - 1]
    // }
  },
  computed: {
    getGlobalInfo () {
      return store.getters.getGlobalInfo
    },
    getPlace () {
      // alert(JSON.stringify(store.getters.getPlace))
      return store.getters.getPlace
    },
    isIos () {
      return /iPhone|iPod/i.test(navigator.userAgent)
    },
    getUserId () {
      if(this.$route.params.empId !=undefined){
        this.empId = this.$route.params.empId;
      } else if(store.getters.getEmpInfo != null){
        this.empId = store.getters.getEmpInfo;
      } else {
        this.empId = 1;
      }
      return this.empId;
    }
  },
  components: {
    weather
  },
  mounted (){
    this.setEmpInfo();
    this.setUserInfo();
    bus.$on('msg', res => {
      this.setUserInfo();
    })
  },
  watch: {
    '$route' (to) {
      this.setEmpInfo();
      this.setUserInfo();
    }
  }
}
</script>
<style lang="stylus" rel="stylesheet/stylus">
@import '../../../common/stylus/border-1px/index.styl'
@import '../../../common/stylus/global.styl'
  .div_content
    position:fixed
    top:0
    left:0
    right:0
    height:40px
    line-height:40px
    .ul-header
      position:fixed
      top:0
      left:0
      right:0
      height:40px
      line-height:40px
      z-index:111
      margin:0
      font-size:0
      padding:0 20px
      .left-menu
        a
          list-style:none
          display:inline-block
          font-size:14px
          padding:0 14px
          margin:0
          color:$text_color
          cursor:pointer
          font-family:"Segoe UI",Segoe,Tahoma,Arial,Verdana,sans-serif
          text-decoration:none
          &.router-link-active
            li
              color:$text_color_active
              border-bottom:1px solid $border_color
          &.logo
            padding-left:0
          img
            width:36px
            vertical-align:middle
            border: none
      .right-menu
        position:absolute
        right:10px
        height:40px
        top:0
        font-size:0
        .listmenu
          display:inline-block
          font-size: 14px
          margin:0 8px
          height:100%
          vertical-align: middle
          color:$text_color
          vertical-align:top
          cursor:pointer
          position:relative
          font-weight: 200
          &.router-link-active
            color:$text_color_active
            border-bottom:1px solid $border_color
        a
          list-style:none
          display:inline-block
          font-size:14px
          margin:0 8px
          color:$text_color
          cursor:pointer
          font-family:"Segoe UI",Segoe,Tahoma,Arial,Verdana,sans-serif
          text-decoration:none
          &.router-link-active
            li
              color:$text_color_active
              border-bottom:1px solid $border_color
          li
            // border-bottom:none
            display:flex
            height:40px
            align-items:center
            i
              font-size:18px
              vertical-align: middle
      .fixed-menu
        position:absolute
        left:0
        top:0
        width:50px
        height:40px
        line-height:40px
        text-align:center
        i
          display: inline-block
          font-size: 20px
          vertical-align: middle
          color:$text_color
        &.active
          i
            color:$text_color_active
      .fixed-fade-menu
        position:fixed
        top: 0
        left: 0
        bottom: 0
        right: 0
        background: rgba(0,0,0,0.86)
        &.ios
          -webkit-backdrop-filter: blur(10px)
          background:rgba(0,0,0,0.5)
        &.fade-enter-to,&.fade-leave-to
          transition: all 0.5s
        &.fade-enter,&.fade-leave-to
          opacity:0
        // .fixed-list
        //   position:fixed
        //   top: 0
        //   left: 0
        //   bottom: 0
        //   width:280px
        //   height:100%
        //   background:red
        //   z-index:101
        //   transform:translate3d(0,0,0)
        //   &.slide-left-enter-to,&.slide-left-leave-to
        //     transition: all 0.8s
        //   &.slide-left-enter,&.slide-left-leave-to
        //     transform:translate3d(0,-280px,0)
        .fixed-menu-content
          width:100%
          height:100%
          padding:10px
          box-sizing:border-box
          font-size:14px
          display:flex
          flex-direction:column
          justify-content: center
          a
            text-decoration:none
            li
              color:#fff
              width:100%
              height:40px
              line-height:40px
              text-align:center
            &.router-link-active
              li
                color:$border_color
                // border-bottom:1px solid $border_color
    .li_list
      transform:translate3d(0,0,0)
      &.fade-enter-to,&.fade-leave-to
        transition: all 0.8s
      &.fade-enter,&.fade-leave-to
        opacity:0
        transform:translate3d(0,50px,0)
</style>
