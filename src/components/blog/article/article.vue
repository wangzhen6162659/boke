<template>
    <div id="app" @resize="isApp" class="article" @click="back">
      <transition name="fade">
        <div class="bg_article" v-show="showarticle"></div>
      </transition>
      <transition name="silde-bottom">
        <div class="article_select" v-show="showarticle">
          <div class="select_type">
            <div class="select_title">{{obj.title}}</div>
            <div class="select_content" v-html="obj.content"></div>
          </div>
          <div class="select_type">
            <div class="select_message">
              评论
              <div v-for="obj in userMessage">
                <div class="select_user">
                  <img v-bind:src="obj.photo"/>
                  <div class="select_user_content">
                    还行
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </transition>
    </div>
</template>
<script>
  // import musicApi from './../music.js'
  import store from './../../../store'
  import fecth from 'utils/fecth.js'
  export default {
    data () {
      return {
        showarticle: false,
        obj: {},
        userMessage: []
      }
    },
    methods: {
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
      back () {
        this.$router.go(-1)
      },
      clickarticleMusic (e) {
        this.$router.push({name: 'articlelist', params: { w: e.target.innerHTML }})
      },
      init () {
        var id = this.$route.params.id
        let api = 'http://192.168.1.124:9999/api/admin/article/getArticle?id=' + id
        fecth.get(api).then((res) => {
          var data = res.data.data
          this.obj = data
        })
      },
      getUserMessage () {
        var id = this.$route.params.id
        let api = 'http://192.168.1.124:9999/api/admin/user/get?id=' + id
        fecth.get(api).then((res) => {
          var data = res.data.data
          this.userMessage.push(data)
          this.userMessage.push(data)
          console.log(this.userMessage)
        })
      }
    },
    mounted () {
      this.init()
      this.getUserMessage()
      this.showarticle = true
      this.$nextTick(() => {
        this.$refs.articleVal.focus()
      })
    }
  }
</script>
<style lang="stylus" rel="stylesheet/stylus">
@import '~common/response.css'
@import '~common/stylus/global.styl'
@import '~common/stylus/style.styl'
.article
  position:fixed
  left:0
  right:0
  bottom:0
  top:0
  padding:20px
  box-sizing:border-box
  z-index:11
  vertical-align:middle
  .bg_article
    background:rgba(0,0,0,0.8)
    position:absolute
    left:0
    right:0
    bottom:0
    top:0
    opacity:1
    &.fade-enter-to,&.fade-leave-to
      transition: all 0.3s
    &.fade-enter,&.fade-leave-to
      opacity:0
  .article_content
    width:500px
    max-width:100%
    margin:0 auto
    position:relative
    margin-top:30px
    &.silde-top-enter-to,&.silde-top-leave-to
      transition: all 0.3s
    &.silde-top-enter,&.silde-top-leave-to
      opacity:0
      transform:translate3d(0,-50px,0)
    .article_input
      display:block
      width:100%
      height:40px
      text-indent:4px
      font-size:14px
      margin:0
      padding:0
      box-sizing:border-box
      background:transparent
      color:$text_before_color
      border:1px solid $text_before_color
      outline:none
    .article-btn
      position:absolute
      right:0
      top:0
      width:60px
      height:100%
      color:#fff
      border-left:1px solid $text_before_color
      text-align:center
      cursor:pointer
  .article_select
    width:1400px
    max-width:100%
    margin:0 auto
    position:relative
    margin-top:50px
    font-size:0
    height: calc(100% - 140px)
    overflow-y:auto
    overflow-x:hidden
    &.silde-bottom-enter-to,&.silde-bottom-leave-to
      transition: all 0.8s 0.2s
    &.silde-bottom-enter,&.silde-bottom-leave-to
      opacity:0
      transform:translate3d(0,50px,0)
    .select_type
      width:100%
      height:auto
      margin-bottom:20px
      .select_title
        width:100%
        height:50px
        line-height:50px
        margin:0
        font-size:18px
        color:$text_color
        text-indent:5px
        border-bottom:1px solid $border_bottom_color
        margin-bottom:10px
	      text-align:center
      .select_content
        width:100%
        line-height:50px
        margin:0
        font-size:18px
        color:$text_color
        text-indent:5px
        margin-bottom:10px
        border-bottom:1px solid $border_bottom_color
        text-align: center;
        .pic_center
          /*background-image: url(http://192.168.1.124:6080/file/xiaojiejie.jpg);*/
          background-size: cover;
          width:100%
          text-align:center;
      .select_message
        width:100%
        line-height:50px
        margin:0
        font-size:25px
        color:$text_color
        text-indent:5px
        margin-bottom:10px
        text-align: left;
        .select_user
          width:100%
          line-height:50px
          margin:0
          color:$text_color
          font-size:15px
          text-indent:5px
          margin-bottom:10px
          border-top:1px solid $border_bottom_color
          float:left;
	      .select_user_content
          width:100%
          line-height:50px
          margin:0
          color:$text_color
          font-size:15px
          text-indent:5px
          margin-bottom:10px
          border-left:1px solid $border_bottom_color
          display:inline
      .select_span
        display:inline-block
        width:auto
        padding:2px 10px
        height:20px
        line-height:20px
        border-radius:2px
        cursor:pointer
        margin:15px 8px
        font-size:14px
        color:$text_before_color
        border:1px solid $text_before_color
        &:hover
          color:$text_color
          border:1px solid $text_color
</style>
