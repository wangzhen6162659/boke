<template>
  <div class="articletype">
    <transition name="fade">
      <div class="bg_article" v-show="showarticle"></div>
    </transition>
    <!--<div class="div_back" @click="back"><i class="icon-back"></i></div>-->
  	<div class="articletype_content" v-show="!showList">
  		<div class="articletype_detail">
  			<p class="title">类型名称</p>
	  		<input class="articletype_area" v-model="articleType.typeName" cols="30" rows="2"></input>
	  		<p class="title">类型标签</p>
	  		<input class="articletype_area" v-model="articleType.articlTag" cols="30" rows="2"></input>
        <p class="title">类型描述</p>
        <input class="articletype_area" v-model="articleType.typeDesc" cols="30" rows="2"></input>
	  		<span class="submit_articletype" @click.stop="submitarticletype">提交</span>
        <span class="submit_articletype" @click.stop="back"><i class="icon-back"></i></span>
  		</div>
  	</div>
  </div>
</template>
<script>
import store from 'store'
import fecth from 'utils/fecth.js'
export default {
  props: ['test'],
	data () {
		return {
      showarticle: false,
			showList: false,
      articleType: {
        typeName: '',
        articlTag: '',
        typeDesc: ''
      }
		}
	},
	methods: {
    back () {
      this.$router.go(-1)
    },
    showarticletypeList() {
      this.showList = true
      this.getarticletypeInfo()
    },
    submitarticletype() {
      let api = 'http://192.168.1.124:9999/api/admin/article/saveArticleType'
      var data = this.articleType;
      if (data.typeName === '') {
        this.$msg('类型名称不能为空！')
      } else {
        fecth.postJson(api, data).then((res) => {
          var info = res.data.data;
          if (info != null) {
            this.$notify({
              title: '添加成功',
              type: 'success'
            });
            this.test();
            this.back();
          }else {
            this.$notify({
              title: res.data.errmsg,
              type: 'error'
            });
          }
        })
      }
    }
  },
	mounted () {
    this.showarticle = true
		console.log(store.getters.getUserInfo)
	}
}
</script>
<style lang="stylus" rel="stylesheet/stylus">
  @import '~common/stylus/global.styl'
	.articletype
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
			top:5px
			left:10px
			width:40px
			height:40px
			color:$text_color
			text-align:center
			line-height:42px
			font-size:20px
			border-radius:50%
			transition: all 0.3s
			z-index: 100
			&:hover
				background:rgba(0,0,0,0.3)
		.articletype_content
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
			.articletype_detail
				display:block
				margin:0 auto
				width:400px
				max-width:100%
				.title
					color:$text_color
			.articletype_area
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
			.submit_articletype
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
			.read_articletype
				color: $text_color
				cursor: pointer
				text-align:center
				&:hover
					color: $text_color_active
					text-decoration: underline
		.articletype_lists
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
