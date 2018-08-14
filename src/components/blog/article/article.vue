<template>
    <div id="app" @resize="isApp" class="article" >
      <transition name="fade">
        <div class="bg_article" v-show="showarticle"></div>
      </transition>

      <transition name="silde-bottom">
        <div class="article_select" v-show="showarticle">
          <div class="select_type">

            <span class="submit_articletype" style="width: 50px;height: 50px" @click="backArt"><i class="icon-back"></i></span>
            <div class="select_title">{{obj.title}}</div>
            <div class="select_content" v-html="obj.content" v-hljs></div>
          </div>
          <div class="select_type">
            <div class="select_message">
              评论
              <div class="select_user" v-if="userMessage.length==0" style="text-align: center;float: none;">暂无评论</div>
              <div v-for="(obj,index) in userMessage" style="display: inline-block; width: 100%;">
                <div class="select_user">
                  <div class="article-user-info">
                    <img class="photo" :src="obj.photo">
                  </div>
                  <div class="right-box">
                    <div class="user-name">{{obj.nickname}}
                      <div style="text-align: right;padding-right:8px; float: right;">#{{index+1}}</div>
                    </div>

                    <div class="user-time">{{obj.createTime}}</div>
                    <div class="text-content" v-html="obj.content"  v-hljs></div>
                    <div class="receive-content-list" v-if="obj.children.length">
                      <div class="item item1">
                      <div class="item-title">
                        <div v-show="!obj.activeTag" style="text-align: right;padding-right:8px;margin-bottom: -10px;" @click="clickOpen(obj, index),replyThis(obj, index)">回复({{obj.children.length}}))</div>
                        <div v-show="obj.activeTag" style="text-align: right;padding-right:8px;margin-bottom: -10px;" @click="clickClose(obj, index),replyThis(obj, index, 2)" >收起</div>
                      </div>
                        <vertical-toggle>
                          <div class="item-content" v-show="obj.activeTag">
                            <div v-for="(mobj) in obj.children">
                              <!--<img class="photo_reply" :src="mobj.photo">-->
                              <router-link tag="a" :to="'/home/'+mobj.userId">
                                <span style="color:#3a8ee6;">
                                  {{mobj.nickname}}
                                </span>
                              </router-link>
                              <template v-if="mobj.replyName !== null">
                                回复
                                <router-link tag="a" :to="'/home/'+mobj.replyId">
                                  <span style="color:#3a8ee6;">
                                  {{mobj.replyName}}
                                  </span>
                                </router-link>
                              </template>
                              : {{mobj.content}}
                              <button @click="replyChild(mobj, index, obj.id)">回复</button>
                            </div>
                            <div style="text-align: right;padding-right:8px;">
                              <button @click="replyThis(obj, index)">我来说一句</button>
                            </div>
                            <div v-show="replyWindow(index)" style="text-align: center;padding-right:8px;" >
                              <input class="user-input" v-model="defaultMsg" :placeholder="placeholder" ref="defaultText">
                                <button @click="getText(placeholderId, index)">发表</button>
                              </input>
                            </div>
                          </div>

                        </vertical-toggle>
                      </div>
                    </div>
                    <div class="receive-content-list" v-if="obj.children.length<1">
                      <div v-show="getEmpty(index)" style="text-align: right;padding-right:8px;margin-bottom: -5px;" @click="clickEmpty(obj, index)" >回复({{obj.children.length}}))</div>
                      <div v-show="!getEmpty(index)" style="text-align: right;padding-right:8px;margin-bottom: -10px;" @click="clickEmpty(obj, index, 2)" >收起</div>
                      <vertical-toggle>
                        <div v-show="!getEmpty(index)">
                          <div class="item-content" style="text-align: center;padding-right:8px;">
                            <input class="user-input" v-model="defaultMsg" :placeholder="placeholder" ref="defaultText">
                              <button @click="getText(placeholderId, index)">发表</button>
                            </input>
                          </div>
                        </div>
                      </vertical-toggle>
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
              <div>
                <div class="select_ueditor">
                  <UEditor :config=config ref="ueditor"></UEditor>
                </div>
                <div style="text-align: right;padding-right:8px;">
                  <button @click="getUEContent()">发表</button>
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
  import apiList from 'common/api/articleApiList.js'
  import VerticalToggle from 'utils/vertical-toggle.js'
  import UEditor from 'components/ueditor/ueditor.vue'
  import hljs from 'highlight.js'
  import myUtiles from 'utils/myUtiles.js'
  import Vue from 'vue'
  import $ from 'jquery'
  Vue.directive('hljs', el => {
    let blocks = el.querySelectorAll('pre');
    Array.prototype.forEach.call(blocks, hljs.highlightBlock);
  });

  export default {
    data () {
      return {
        showarticle: false,
        obj: {},
        userMessage: [],
        inputIndex: -1,
        emptyIndex: -1,
        defaultMsg: '',
        placeholder: '',
        placeholderId: '',
        replyId: '',
        config: {
          /*//可以在此处定义工具栏的内容
          toolbars: [
            ['fullscreen', 'source','|', 'undo', 'redo','|','bold', 'italic', 'underline', 'fontborder', 'strikethrough',
              '|','superscript','subscript','|', 'forecolor', 'backcolor','|', 'removeformat','|', 'insertorderedlist', 'insertunorderedlist',
              '|','selectall', 'cleardoc','fontfamily','fontsize','justifyleft','justifyright','justifycenter','justifyjustify','|',
              'link','unlink']
          ],*/
          autoHeightEnabled: false,
          autoFloatEnabled: true,　　//是否工具栏可浮动
          initialContent:'',   //初始化编辑器的内容,也可以通过textarea/script给值，看官网例子
          autoClearinitialContent:true, //是否自动清除编辑器初始内容，注意：如果focus属性设置为true,这个也为真，那么编辑器一上来就会触发导致初始化的内容看不到了
          initialFrameWidth: null,
          initialFrameHeight: 450,
          BaseUrl: '',
          UEDITOR_HOME_URL: 'static/ueditor/'
        },
        addFormVisible: false,
      }
    },
    components: {
      VerticalToggle,
      UEditor
    },
    methods: {
      backArt () {
        var type = this.$route.params.type;
        this.$router.push('/blog/'+myUtiles.getEmpId(this.$route)+'/articlelist/' + type);
      },
      getPlaceholder (obj) {
        this.placeholder = '回复：' + obj.nickname;
        this.placeholderId = obj.id;
      },
      getEmpty (index) {
        if (index === this.emptyIndex) {
          return false;
        }
          return true;
      },
      clickEmpty (obj, index, type) {
        this.replyId = null;
        this.defaultMsg = '';
        if (this.emptyIndex === index) {
          this.emptyIndex = -1;
        } else {
          if (type !== 2) {
            this.emptyIndex = index;
            this.inputIndex = -1;
          }
        }
        this.getPlaceholder(obj);
      },
      getContent () {
        let content = this.$refs.ue.getUEContent();
      },
      clickOpen (obj, index) {
        obj.activeTag = !obj.activeTag
        // this.inputIndex = index
      },
      clickClose (obj, index) {
        obj.activeTag = !obj.activeTag
        // this.inputIndex = -1
      },
      replyThis (obj, index, type) {
        this.replyId = null;
        this.defaultMsg = '';
        if (this.inputIndex === index){
          this.inputIndex = -1;
        } else {
          if (type !== 2) {
            this.inputIndex = index;
            this.emptyIndex = -1;
          }
        }
        this.getPlaceholder(obj);
      },
      replyChild (obj, index, parentId) {
        this.replyId = null;
        this.defaultMsg = '';
        this.inputIndex = index;
        this.emptyIndex = -1;
        this.getPlaceholder(obj);
        this.placeholderId = parentId;
        this.replyId = obj.userId;
      },
      replyWindow (index) {
        if (this.inputIndex === index){
          return true;
        }
        return false;
      },
      initMessage() {
        this.inputIndex = -1;
        this.emptyIndex = -1;
        this.defaultMsg = '';
        this.placeholder = '';
        this.placeholderId = '';
        this.replyId = '';
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
      init () {
        var id = this.$route.params.id
        fecth.get(apiList.getArticle, {id : id}).then((res) => {
          var data = res.data.data
          this.obj = data
          this.initHighlight()
          myUtiles.setTitle('NoteX-' + '博客-' + this.obj.title);
        })
      },
      getUserMessage () {
        var id = this.$route.params.id
        fecth.get(apiList.findReply, {id : id}).then((res) => {
          var data = res.data.data
          this.userMessage = data
        })
      },
      //一般回复
      getText (parentId, index) {
        // let content = this.$refs.defaultText.getUEContent(); // 调用子组件方法
        var content = this.defaultMsg
        if (content.length == 0){
          this.$msg('请输入内容')
          return
        }
        var articleId = this.$route.params.id;
        var data = {articleId: articleId, parentId: parentId, content: content, replyId: this.replyId}
        fecth.postJson(apiList.saveReply, data).then((res) => {
          var info = res.data.data;
          if (info != null) {
            this.userMessage[index] = info;
            this.$msg('回复成功！')
            this.userMessage[index].activeTag = true;
            this.initMessage();
          }else {
            this.$msg({text: res.data.errmsg, background: 'red'})
          }
        })
      },
      //富文本编辑回复
      getUEContent() {
        let content = this.$refs.ueditor.getUEContent(); // 调用子组件方法
        if (content.length == 0){
          this.$msg('请输入内容')
          return
        }
        var articleId = this.$route.params.id;
        var parentId = '-1';
        let api = apiList.saveReply;
        var data = {articleId: articleId, parentId: parentId, content: content}
        fecth.postJson(api, data).then((res) => {
          var info = res.data.data;
          if (info != null) {
            this.userMessage.push(info)
            this.$msg('回复成功！')
          }else {
            this.$msg({text: res.data.errmsg, background: 'red'})
          }
        })
      },
      initHighlight () {
        hljs.initHighlightingOnLoad();
      }
    },
    mounted () {
      this.init()
      this.getUserMessage()
      this.showarticle = true
      // this.getReady(); // Ready
      // hljs.initHighlightingOnLoad();
      // this.$nextTick(() => {
      //   this.$refs.articleVal.focus()
      // })
    }
    // watch: {
    //   '$route' (to, from) {
    //     console.log(to)
    //     // this.init()
    //     this.getUserMessage()
    //     this.showarticle = true
    //   }
    // }
  }
</script>
<style lang="stylus" rel="stylesheet/stylus">
@import '~common/response.css'
@import '~common/stylus/global.styl'
@import '~common/stylus/style.styl'
@import "~highlight.js/styles/railscasts.css";
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
    position:fixed
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
      .submit_articletype
        display:block
        width:100%
        height:50px
        line-height:50px
        margin-top:30px
        color:$text_color
        font-size:16px
        text-align: center;
        cursor:pointer
        transition:background 0.3s
        &:hover
          background: $btn_hover_color
      .select_title
        width:100%
        height:50px
        line-height:50px
        margin:0
        font-size:30px
        color:$text_color
        text-indent:5px
        border-bottom:1px solid $border_bottom_color
        margin-bottom:10px
	      /*text-align:center*/
      .select_content
        width:100%
        line-height:15px
        margin:0
        font-size:4px
        color:$text_color
        text-indent:5px
        margin-bottom:10px
        border-bottom:1px solid $border_bottom_color
        width: 80%;
        /*text-align: center;*/
        .pic_center
          /*background-image: url(http://192.168.1.124:6080/file/xiaojiejie.jpg);*/
          background-size: cover;
          width:100%
          text-align:center;
      .select_message
        width:100%
        /*line-height:20px*/
        margin:0
        font-size:25px
        color:$text_color
        text-indent:5px
        margin-bottom:10px
        text-align: left;
        .select_user
          width:100%
          line-height:35px
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
      .article-user-info
        /*width:200px;*/
        float:left;
      .right-box
        float:left;
        width: calc(100% - 200px);
      .text-content
        min-height: 270px;
        box-sizing: border-box;
	img {
	 width: 100%;
	}
      .receive-content-list
        padding: 12px;
        background: rgba(255,255,255,0.1);
        border-radius: 8px;
      .photo_reply
        /*width: 50px;*/
        /*height: 50px;*/
      .item {
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
      .article-user-info
        width: 30px !important;
      .photo_reply
        width: 30px;
        height: 30px;
      .article-user-info img.photo
        margin-top: 15px;
        width: 30px;
        height: 30px;
        border-radius:30px;
      .user-name
        padding-left: 8px;
        margin-top:15px;
        line-height: 12px;
        font-size: 14px;
      .user-input
        width: 80%;
        height: 100%;
        border-radius: 10px;
        /*margin-left: 20px;*/
        margin-top: 20px;
	    .select_ueditor
	      width:100%
        line-height:50px
        margin:0
        font-size:25px
        color:$text_color
        text-indent:5px
        margin-bottom:10px
        text-align: left;
        border-bottom:1px solid $border_bottom_color
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
        margin-left: 30px;
      .article-user-info
        width: 100px !important;
      .article-user-info img.photo
        margin-top: 15px;
        width: 100px;
        height: 100px;
        border-radius:8px;
      .user-name
        line-height: 12px;
        font-size: 14px;
        margin-left: 30px;
        margin-top: 20px;
      .user-time
        line-height: 12px;
        font-size: 14px;
        margin-left: 30px;
        margin-top: 10px;
        margin-bottom: 10px;
      .user-input
        width: 80%;
        height: 100%;
        border-radius: 10px;
        /*margin-left: 20px;*/
        margin-top: 20px;

</style>

