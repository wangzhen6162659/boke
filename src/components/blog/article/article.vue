<template>
    <div id="app" @resize="isApp" class="article" >
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
                  <div class="user-info">
                    <img class="photo" :src="obj.photo">
                  </div>
                  <div class="right-box">
                    <div class="user-name">{{obj.nickname}}</div>
                    <div class="text-content">{{obj.content}}</div>
                    <div class="receive-content-list" v-if="obj.children.length">
                      <div class="item item1">
                      <div class="item-title" @click="obj.activeTag = !obj.activeTag">
                        <div v-show="obj.activeTag" style="text-align: right;padding-right:8px;">回复</div>
                        <div v-show="!obj.activeTag" style="text-align: right;padding-right:8px;">点击展开({{obj.children.length}}条回复)</div>
                      </div>
                      <vertical-toggle>
                        <div class="item-content" v-show="obj.activeTag">
                      <div v-for="mobj in obj.children">
                        <!--<img class="photo_reply" :src="mobj.photo">-->
                        {{mobj.nickname}}
                          <template v-if="mobj.replyName !== null">
                            回复 {{mobj.replyName}}
                          </template>
                        : {{mobj.content}}
                      </div>
                        </div>
                      </vertical-toggle>
                      </div>
                    </div>
                    <div class="receive-content-list" v-if="obj.children.length<1">
                      <span>暂无评论</span>
                    </div>
                  </div>
                  <!--<div>-->
                    <!--<img class="select_user_photo" v-bind:src="obj.photo"/>-->
                    <!--<div class="select_user_content">-->
                      <!--{{obj.content}}-->
                    <!--</div>-->
                    <!--<div class="select_user_name">-->
                      <!--{{obj.nickname}}-->
                    <!--</div>-->
                    <!--<div class="select_user_reply" v-for="mobj in obj.children">-->
                      <!--<div>-->
                        <!--{{mobj.content}}-->
                      <!--</div>-->
                    <!--</div>-->
                  <!--</div>-->
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
  import VerticalToggle from 'utils/vertical-toggle.js'
  export default {
    data () {
      return {
        showarticle: false,
        obj: {},
        userMessage: []
      }
    },
    components: {
      VerticalToggle
    },
    methods: {
      togglebox () {
        this.boxshow = !this.boxshow
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
        let api = 'http://192.168.1.124:9999/api/admin/reply/findReply?id=' + id
        fecth.get(api).then((res) => {
          var data = res.data
          this.userMessage = data
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
          float:left
          .select_user_photo
            width:20%
            line-height:50px
            margin:0
            text-indent:5px
            margin-bottom:10px
            margin-top:20px
            margin-right:20px
            float:left
	        .select_user_name
            width:20%
            line-height:50px
            margin:0
            text-indent:5px
            margin-bottom:10px
            margin-top:20px
            margin-right:20px
            /*float:left*/
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
	      .select_user_reply
          width:100%
          line-height:50px
          margin:0
          color:$text_color
          font-size:15px
          text-indent:5px
          margin-left:10px
          float:left
          /*border-left:1px solid $border_bottom_color*/
          border-bottom:1px solid $border_bottom_color
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
      .user-info
        /*width:200px;*/
        float:left;
      .right-box
        float:left;
        width: calc(100% - 200px);
      .text-content
        min-height: 270px;
        box-sizing: border-box;
      .receive-content-list
        padding: 12px;
        background: rgba(255,255,255,0.1);
        border-radius: 8px;
      .photo_reply
        /*width: 50px;*/
        /*height: 50px;*/
      .item {
        margin-bottom: 20px;
      }
      .item-title {
        height: 30px;
        line-height: 30px;
      }
      .item .item-content {
        padding: 0;
        line-height: 25px;
      }
    @media screen and (max-width: 700px)
      .right-box
        width: calc(100% - 30px) !important;
      .receive-content-list
        margin-left: 20px;
        padding: 5px !important;
        background: rgba(255,255,255,0.1);
        border-radius: 8px;
        font-size: 12px;
      .text-content
        font-size:12px;
        padding-left: 12px;
        min-height: 80px !important;
      .user-info
        width: 30px !important;
      .photo_reply
        width: 30px;
        height: 30px;
      .user-info img.photo
        margin-top: 15px;
        width: 30px;
        height: 30px;
        border-radius:30px;
      .user-name
        padding-left: 8px;
        margin-top:15px;
        line-height: 12px;
        font-size: 14px;
    @media screen and (min-width: 700px)
      .right-box
        width: calc(100% - 100px) !important;
      .receive-content-list
        margin-left: 30px;
        padding: 5px !important;
        background: rgba(255,255,255,0.1);
        border-radius: 8px;
      .text-content
        min-height: 120px !important;
      .user-info
        width: 100px !important;
      .user-info img.photo
        margin-top: 15px;
        width: 100px;
        height: 100px;
        border-radius:8px;
      .user-name
        line-height: 12px;
        font-size: 14px;
</style>
