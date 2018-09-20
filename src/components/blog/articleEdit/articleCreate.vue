<template>
  <div class="fullform">
    <transition name="fade">
      <div class="bg_article" v-show="showarticle"></div>
    </transition>
    <!--<div class="div_back" @click="back"><i class="icon-back"></i></div>-->
  	<div class="fullform_content" v-show="!showList">
  		<div class="fullform_detail">
  			<p class="title">文章名称</p>
	  		<input class="fullform_area" v-model="articleSave.title" cols="30" rows="2"></input>
	  		<p class="title">文章类型</p>
        <select class="fullform_area" v-model="articleSave.type">
          <option disabled value="">请选择</option>
          <option style="color: #000" v-for="option in articleTypes" v-bind:value="option.id">
            {{ option.typeName }}
          </option>
        </select>
        <p class="title">文章内容</p>
          <UEditor :config=config ref="ueditor"></UEditor>
	  		<span class="submit_fullform" @click.stop="getUEContent">提交</span>
        <span class="submit_fullform" @click.stop="back"><i class="icon-back"></i></span>
  		</div>
  	</div>
  </div>
</template>
<script>
import store from 'store'
import fecth from 'utils/fecth.js'
import UEditor from 'components/ueditor/ueditor.vue'
import apiList from 'common/api/articleApiList.js'
export default {
  props: ['test'],
	data () {
		return {
      userId: store.getters.getEmpInfo,
      showarticle: false,
			showList: false,
      articleTypes: [],
      articleSave: {
        title: '',
        content: '',
        type: ''
      },
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
        initialContent:'请输入内容',   //初始化编辑器的内容,也可以通过textarea/script给值，看官网例子
        autoClearinitialContent:true, //是否自动清除编辑器初始内容，注意：如果focus属性设置为true,这个也为真，那么编辑器一上来就会触发导致初始化的内容看不到了
        initialFrameWidth: null,
        initialFrameHeight: 450,
        BaseUrl: '',
        UEDITOR_HOME_URL: '/static/ueditor/'
      }
		}
	},
  components: {
    UEditor
  },
	methods: {
    back () {
      this.$router.go(-1)
    },
    showSuggestList() {
      this.showList = true
      this.getSuggestInfo()
    },
    getBlogType () {
      const vm = this
      fecth.get(apiList.findTypeByUser, {id: this.userId}).then((res) => {
        this.articleTypes = res.data.data;
      })
    },
    //富文本编辑
    getUEContent() {
      let content = this.$refs.ueditor.getUEContent(); // 调用子组件方法
      this.articleSave.content = content;
      var data = this.articleSave;
      fecth.postJson(apiList.saveArticle, data).then((res) => {
        var info = res.data.data;
        if (info != null) {
          this.$notify({
            title: '发表成功！',
            type: 'success'
          });
          this.back();
        }else {
          this.$notify({
            title: res.data.errmsg,
            type: 'error'
          });
        }
      })
    }
  },
	mounted () {
    this.showarticle = true
    this.getBlogType();
	}
}
</script>
<style lang="stylus" rel="stylesheet/stylus">
  @import '~common/stylus/global.styl'
	.fullform
	  	position:fixed
	    top:0
	    left:0
	    bottom:0
	    width:100%
	    right:0
	    border-radius:12px
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
		.div_back
			position:absolute
			top:-5px
			left:5px
			width:40px
			height:40px
			color:$text_color
			text-align:center
			line-height:42px
			font-size:20px
			border-radius:50%
			transition: all 0.3s
			z-index:1000
			&:hover
				background:rgba(0,0,0,0.3)
		.fullform_content
			position:fixed
			top:50px
			bottom:0
			left:50%
			max-width:1240px
			width:100%
			transform:translate3d(-50%,0,0)
			margin:0 auto
			overflow-y:auto
			box-sizing:border-box
			-webkit-overflow-scrolling: touch
			padding:15px
			box-sizing:border-box
			opacity:1
			transition: all 0.5s 0.3s
			.type_name
				color:#fff
				margin:0
			.fullform_detail
				display:block
				margin:0 auto
				/*width:400px*/
				max-width:100%
				.title
					color:$text_color
			.fullform_area
				background:transparent
				color:$text_color
				resize: none
				width:100%
				display:block
				margin:0 auto
				outline:none
				padding:10px
				border:1px solid $text_color
				box-sizing:border-box
				line-height:1.5
			.submit_fullform
				display:block
				width:100%
				height:50px
				line-height:50px
				margin-top:30px
				color:$text_color
				font-size:16px
				text-align:center
				box-sizing:border-box
				border:1px solid $text_color
				cursor:pointer
				transition:background 0.3s
				&:hover
					background: $btn_hover_color
			.read_fullform
				color: $text_color
				cursor: pointer
				text-align:center
				&:hover
					color: $text_color_active
					text-decoration: underline
		.fullform_lists
			position: absolute
			top:0
			left:0
			right:0
			bottom:0
			color:$text_color
			.lists_c
				width:100%
				max-width: 400px
				position: absolute
				top: 50px
				left: 50%
				padding:0
				transform: translate3d(-50%,0,0)
				.title
					padding: 25px 0
					display:inline-block
				li
					list-style: none
					.name
						font-size:16px
						margin-right 10px
						color: $active_color
						font-weight: 500
</style>
