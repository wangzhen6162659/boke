<template>
  <div class="boke_play">
    <div class="list_content_info">
      <div class="boke_list_title border-1px">
        <span class="boke_index"></span>
        <span class="boke_name">标题</span>
        <span class="boke_duration">发表时间</span>
      </div>
      <!--<bokelist v-if="bokelist" :bokelist = "bokelist"></bokelist>-->
      <div class="bokelist boke_list_container">
        <transition name="slide-fade">
      <scroll :data ="bokelist" class="boke_l_content" :needPullUp=true v-if="show">
        <div class="content">
          <!--<span class="list_empty" v-if="isInit">暂无文章列表哦 !</span>-->
          <span class="list_empty" v-if="bokelist[0].length==0">暂无文章列表哦 !</span>
          <div class="boke_list border-1px" v-for="(obj, index) in bokelist[0]" :key="obj.id" @click="getArticle(obj.id)">
            <span class="boke_index">
              <span>{{index + 1}}</span>
            </span>
            <div class="boke_name">
              <span>{{obj.title}}</span>
            </div>
            <span class="music_zhuanji" v-if="obj.createTime">
              <span>{{obj.createTime}}</span>
            </span>
          </div>
        </div>
      </scroll>
        </transition>
      </div>
  </div>
  </div>
</template>

<script>
  import store from 'store'
  import blogApi from 'components/blog/blog.js'
  import Scroll from 'components/common/bscroll/bscroll.vue'
  export default {
    data () {
      return {
        userId: this.$route.params.userId,
        bokelist: [],
        show: false,
        type: ''
      }
    },
    components: {
      scroll: Scroll
    },
    computed: {
      getIsAPP () {
        return store.getters.getGlobalInfo
      }
      // isNeedPull () {
      //   // console.log(this.$route.path.includes('/music/searchlist'))
      //   return this.$route.path.includes('/music/searchlist')
      // }
    },
    methods: {
      isInit () {
        if (this.bokelist.length === 0) {
          return true;
        }
      },
      getList () {
        this.bokelist = []
        this.bokelist.push(store.getters.getArticleList)
      },
      setList (type) {
        var axiodata = {
          userId: this.$route.params.userId,
          type: type
        }
        if (axiodata.type !== '' && axiodata.type !== undefined){
          blogApi.getArticleList(axiodata, this.bokelist).then((list) => {
            this.getList()
            this.show = true
          })
        }
      },
      getArticle (id) {
        var path = '/blog/' + this.userId + '/article/' + id
        this.$router.push({path: path})
      }
    },
    mounted () {
      this.type = this.$route.params.type
      this.setList(this.type);
    },
    watch:{
      '$route'(){
        if (this.$route.params.type !== undefined) {
          this.type = this.$route.params.type;
        }
        this.show = false
        this.setList(this.type)
      }
    }
    // beforeRouteUpdate (to, from, next) {
    //   this.show = false
    //   this.setList(to.params.type)
    //   next()
    // }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
	@import '~common/stylus/global.styl'
	@import '~common/stylus/border-1px/index.styl'
  .slide-fade-enter-active {
    transition: all .6s cubic-bezier(1.0, 0.5, 0.8, 1.0);
  }
  .slide-fade-leave-active {
    transition: all .8s cubic-bezier(1.0, 0.5, 0.8, 1.0);
  }
  .slide-fade-enter, .slide-fade-leave-to
    /* .slide-fade-leave-active for below version 2.1.8 */ {
    transform: translateX(10px);
    opacity: 0;
  }
	.boke_list_title,.boke_list
		height:50px
		line-height:50px
		// background:red
		font-size:0
		span
			display:inline-block
			font-size:14px
			color:$text_before_color
			text-overflow:ellipsis
			overflow:hidden
			white-space:nowrap
			vertical-align:middle
			&.boke_name
				width:calc(50% - 50px)
				font-size:14px
			&.boke_singer
				width:20%
				padding:0 5px
				box-sizing:border-box
			&.boke_zhuanji
				width:20%
				padding:0 5px
				box-sizing:border-box
			&.boke_duration
				width:10%
				padding:0 5px
				box-sizing:border-box
			&.boke_index
				width:50px
				height:100%
				text-align: center;
			span
				cursor:pointer
				&:hover
					text-decoration:underline
		.boke_name
			width:calc(50% - 50px)
			display:inline-block
			font-size:14px
			height:50px
			line-height:50px
			color:$text_before_color
			text-overflow:ellipsis
			overflow:hidden
			white-space:nowrap
			font-size:0
			text-align:center
			position:relative
			vertical-align: middle;
			.span_name
				display:inline-block
				width: 100%
				height:100%
				// background:red
				font-size:14px
			.hover_menu
				position:absolute
				width:60px
				height:100%
				right:0
				top:0
				// background:red
				// display:none
				i
					font-size:18px
					display:inline-block
					width:36px
					height:36px
					line-height:36px
					color:$border_bottom_color_deep
					text-align:center
					border-radius:50%
					vertical-align:middle
					border:2px solid $border_bottom_color_deep
					cursor:pointer
					&:hover
						color:$text_before_color
						border:2px solid $text_before_color

		&.border-1px
			border-1px($border_bottom_color,bottom)
	@media screen and (max-width: 998px)
		.boke_list
			.boke_name
				width:calc(50% - 50px)
			.boke_zhuanji
				display:none!important
			.boke_singer
				width:30%!important
			.boke_duration
				width:20%!important
		.boke_list_title
			span
				&.boke_name
					font-size:14px
					width:calc(50% - 50px)
				&.boke_zhuanji
					display:none
				&.boke_singer
					width:30%!important
				&.boke_duration
					width:20%!important
	.boke_list_container
		// height:calc(100% - 50px)
		position:absolute
		top:50px
		left:0
		right:0
		bottom:0
		// overflow:auto
		.boke_l_content
			height: 100%
			overflow: hidden
		.list_empty
			width:100%
			display:block
			padding:10px 0
			text-align:center
			color:$text_before_color
			font-size:14px
		.boke_list
			height: 100%
			position:relative
			// &:hover
			// 	background:$list_hover
			.boke_name
				.hover_menu
					display:none
			&.visible
				.boke_name
					.hover_menu
						display:block
	video
		display:none
</style>
