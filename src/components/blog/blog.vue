<template>
  <div class="music">
    <div class="music_bg" v-if="getIsAPP.isHigher768" :style="{background:'url(' + getCurrentMusic.picurl + ') center center / cover'}">
      <div class="mask_bg"></div>
    </div>
    <div class="mask_linear_bg" v-if="getCurrentMusic.picurl && getIsAPP.isHigher768"></div>
    <div class="music_content">
      <div class="music_body">
        <div class="left_list">
          <div class="music_home">
            <div v-if="getIsAPP.isHigher768" class="select_button" ref="pc">
              <span v-for="obj in pc">
                <router-link tag="span" :to="'/blog/articlelist/'+obj.type" class="todo_btn playing_btn">
                  {{obj.type}}
                </router-link>
              </span>
            </div>
            <div v-if="!getIsAPP.isHigher768" class="select_m_button">
              <span v-for="obj in pc">
                <router-link tag="span" :to="'/blog/articlelist/'+obj.type" class="todo_btn playing_btn">
                  {{obj.type}}
                </router-link>
              </span>
            </div>
            <transition name="silde-top">
              <router-view class="list_content" name="listinfo"></router-view>
            </transition>
          </div>
        </div>
        <transition name="silde-top">
          <router-view class="music_wrapper" name="fullscreen"></router-view>
        </transition>
      </div>
    </div>
  </div>
</template>
<script>
  import store from 'store'
  // import musicApi from 'components/music/music.js'
  import fecth from 'utils/fecth.js'
  export default {
    data () {
      return {
        pc: []
        // isgetimagebybing: store.getters.getShowBingImage
      }
    },
    computed: {
      getCurrentMusic () {
        return store.getters.getCurrentAudio
      },
      getIsAPP () {
        return store.getters.getGlobalInfo
      }
    },
    methods: {
      getBlogType () {
        const vm = this
        let api = 'http://192.168.1.124:9999/api/admin/article/findTypeByUser?id=1'
        fecth.get(api).then((res) => {
          for (var i = 0; i < res.data.data.length; i++) {
            vm.pc.push({type: res.data.data[i]})
          }
        })
      }
    },
    mounted () {
      this.getBlogType()
    }
  }
</script>
<style lang="stylus" rel="stylesheet/stylus" scoped>
	@import '~common/stylus/global.styl'
	@import '~common/stylus/border-1px/index.styl'
	.music
		position:fixed
		top:0
		left:0;
		bottom:0
		width:100%
		right:0
		border-radius:12px
		.music_bg
			position:absolute
			top:0
			left:0;
			bottom:0
			width:100%
			right:0
			z-index:-1
			filter: blur(16px)
			-webkit-backdrop-filter: blur(10px)
			backdrop-filter: blur(10px)
			background-color:#000
			transition:all 0.8s
			.mask_bg
				position:absolute
				top:0
				left:0;
				bottom:0
				width:100%
				right:0
				background:rgba(0,0,0,0.5)
		.mask_linear_bg
			position:absolute
			top:0
			left:0;
			bottom:0
			width:100%
			right:0
			z-index:-2
			background:#000
		.music_content
			position:fixed
			top:80px
			bottom:30px
			left:50%
			right:100px
			left:100px
			// max-width:1240px
			// width:100%
			// transform:translate3d(-50%,0,0)
			margin:0 auto
			overflow-y:auto
			box-sizing:border-box
			-webkit-overflow-scrolling: touch
			padding:15px;
			box-sizing:border-box
			// background:rgba(0,0,0,0.5)
			overflow:hidden
			.music_body
				width:100%
				height: calc(100% - 80px)
				// background:red
				// font-size:0
				display:flex
				position: relative
				padding: 10px 0
				box-sizing: border-box
				.left_list
					width:100%
					height:100%
					overflow: hidden
					position: relative
					flex:1
					.music_home
						// display:inline-block
						flex: 1 1 auto
						width:100%
						height:100%
						// background:#A99E9E
						vertical-align:top
						.select_m_button
							width:100%
							height:60px
							display:flex
							align-items:center
							.todo_btn
								width:auto
								height:24px
								line-height:24px
								color:$text_before_color
								border:1px solid $border_bottom_color_deep
								border-radius:2px
								padding:0px 7px
								margin:10px
								font-size:12px
								cursor:pointer
								&:hover,&.active
									color:$text_before_color
									border:1px solid $text_before_color

						.select_button
							width:100%
							height:60px
							display:flex
							align-items:center
							.todo_btn
								width:auto
								height:32px
								line-height:32px
								color:$text_before_color
								border:1px solid $border_bottom_color_deep
								border-radius:2px
								padding:0 15px
								margin:10px
								font-size:14px
								cursor:pointer
								&:hover,&.active,&.router-link-active
									color:$text_before_color
									border:1px solid $text_before_color
						.list_content
							height:calc(100% - 60px)
							padding:0 10px
							box-sizing:border-box
							overflow:hidden
							position:relative
							overflow:auto
							.music_list_content
								height:calc(100% - 50px)
								position:relative
								overflow:auto
								.music_list
									position:relative
									&:hover
										.music_name
											.hover_menu
												display:block
				.right_info
					// display:inline-block
					flex: 0 0 310px
					width:310px
					max-width:100%
					height:100%
					// background:#6ED367
					vertical-align:top
					position:relative
					.bg-info
						position: relative
						display: block
						width: 186px
						height: 186px
						margin: 0 auto
						// display: flex;
						// align-items: center;
						&::after
							content:''
							background:url('./../../../static/cd_block.png') 0 0 no-repeat
							position:absolute
							top:0
							left:0
							right: -20px
							bottom:0
						.music-bg
							vertical-align: middle;
							width: 176px
							height: 176px
							border:none
							position:absolute
							top:5px
							left:5px
							border-radius: 4px
					.lrc-content
						position:absolute
						top:200px
						left:0
						right:0
						bottom:15px
						overflow:hidden
						padding:20px 0
						box-sizing:border-box
						.lrc-item
							width:100%
							height:auto
							min-height:26px
							line-height:26px
							text-align:center
							margin:0
							color:$text_before_color
							font-size:12px
							&.active
								color:#A7EEBE
			.music_ctrl
				width:100%;
				height:80px
				// background:rgba(0,0,0,0.3)
				display:flex
				.left_ctrl
					flex: 1 1 auto
					display:flex
					.music_detail_ctrl
						display:flex
						align-items:center
						i
							color:$text_before_color
							font-size:38px
							margin:0 10px
							transition:0.5s
							cursor:pointer
							&.playPause
								font-size:46px
							&:hover
								color:$text_color
					.music_progress
						width: 100%
						padding: 0 20px
						box-sizing:border-box
						display:flex
						align-items:center
						flex-direction:column
						justify-content: center
						.music_current_detail
							display:block
							width:100%
							height:auto
							color:$text_before_color
							margin-bottom: 10px
							font-size:0
							overflow:hidden
							.music_c_name
								display:inline-block
								// text-align:left
								width:calc(100% - 115px)
								white-space:nowrap
								overflow:hidden
								text-overflow:ellipsis
								font-size:16px
								vertical-align:top
								// float:left
							.music_c_time
								display:inline-block
								font-size:16px
								vertical-align:top
								text-align:right
								white-space:nowrap
								overflow:hidden
								text-overflow:ellipsis
								// text-align:right
								width:110px
								// float:right

						.music_progress_bar
							width:100%
							height:2px
							// background:$text_color_opacity
							box-sizing:border-box
							position:relative
							cursor:pointer
							&:before{
								content: ''
								position:absolute
								bottom:2px
								width:100%
								height:10px
								background:transparent
							}
							.duration
								width:100%
								height:2px
								position:relative
								background:$progress_color
								border-radius: 1px
								.buffering
									width:20%
									height:100%
									background:$buffering_color
									border-radius: 1px
									position:absolute
									top:0
									left:0
									transition:width 0.3s
								.real
									width:10%
									position:absolute
									height:100%
									left:0
									background:$real_color
									border-radius: 1px
									// transition:width 0.3s
							.range
								// position:absolute
								// top:-4px
								// right:-4px
								// width:10px
								// height:10px
								// border-radius: 50%
								// background:$range_color
								// cursor:pointer
								width: 6px
								height: 6px
								margin-top: -3px
								margin-left: 0
								border-radius: 50%
								background-color: #f00
								position: absolute
								left: 0
								top: 50%
								z-index: 2
								cursor:pointer
								&:before
									content: " ";
									display: block;
									position: absolute;
									width: 24px;
									height: 24px;
									border-radius: 50%;
									background: radial-gradient(rgba(0, 0, 0, 0) 20%, rgba(255, 255, 255, 0.6) 50%, rgba(0, 0, 0, 0) 60%);
									top: 50%;
									margin-top: -12px;
									margin-left: -9px;
									cursor: pointer;
									outline: 0;
									-webkit-tap-highlight-color: transparent;


				.right_ctrl
					flex: 0 0 310px
					display:flex
					align-items:center
					// justify-content:space-between
					justify-content:center
					.play_type
						color:$text_before_color
						width:66px
						height:24px
						line-height:24px
						text-align:center
						font-size:12px
						cursor:pointer
						border:1px solid $border_bottom_color
						&:hover
							border:1px solid $border_bottom_color_deep
				@media screen and (max-width: 922px)
					.right_ctrl
						display:none
		@media screen and (max-width: 1440px)
			.music_content
				top:40px
				bottom:20px
				right:20px
				left:20px
		@media screen and (max-width: 1200px)
			.music_content
				.music_body
					.left_list
						.list_content
							.music_list_content
								.music_list
									position:relative
									&:hover
										.music_name
											.hover_menu
												display:none
		@media screen and (max-width: 998px)
			.music_content
				.music_body
					.left_list
						.list_content
							.music_list
								span
									&.music_name
										width:calc(50% - 50px)
									&.music_zhuanji
										display:none!important
									&.music_singer
										width:30%!important
									&.music_duration
										width:20%!important
							.music_list_title
								span
									&.music_name
										font-size:14px
										width:calc(50% - 50px)
									&.music_zhuanji
										display:none
									&.music_singer
										width:30%!important
									&.music_duration
										width:20%!important
		@media screen and (max-width: 922px)
			.music_content
				.music_body
					.right_info
						position:absolute
						top:0
						left:0
						right:0
						bottom:0
						width:100%
						display:none
		@media screen and (max-width: 525px)
			.music_content
				top: 40px
				bottom: 0px
				right: 0px
				left: 0px
				padding:0
				.music_body
					height:calc(100% - 110px)
					.left_list
						.select_button
							.todo_btn
								padding:0 10px
								overflow:hidden
								text-overflow:ellipsis
								overflow:hidden
								font-size:14px
								height:32px
								line-height:32px
						.list_content
							.music_list
								.music_duration
									// display:none!important
									width:20%!important
								.music_singer
									width:30%!important
								.music_name
									width:calc(100% - 50px)
							.music_list_title
								display:none
							.music_list_container
								top:0
						.music_list_content
							height:100%!important
				.music_ctrl
					height:110px
					.left_ctrl
						flex-direction: column
						.music_detail_ctrl
							justify-content:space-between
							padding:0 50px
							margin-bottom:6px
							i
								font-size:32px!important
							.playPause
								font-size:38px!important
						.music_progress
							.music_current_detail
								margin-bottom:3px
								position:relative

	video
		display:none
</style>
