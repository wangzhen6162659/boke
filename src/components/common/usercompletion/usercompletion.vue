<template>
	<div class="usercompletion singin_then">
		<div class="then_content">
			<h3 class="title">请完善以下流程</h3>
			<div class="select_menu">
				<div class="menu_list" data-index="0" :class="singinThenStatus === 0 ? 'active': ''">基本信息</div>
				<div class="menu_list" data-index="1" :class="singinThenStatus === 1 ? 'active': ''">个人描述</div>
				<div class="menu_list" data-index="2" :class="singinThenStatus === 2 ? 'active': ''">完成注册</div>
			</div>
			<div class="select_content">
				<div class="content_list" v-show="singinThenStatus === 0">
					<div class="block_area">
						<label for="name">姓名</label>
						<input type="text" id="name" v-model="name" placeholder="请输入您的姓名">
					</div>
					<div class="block_area">
						<label>你是GG还是MM？</label>
						<div class="div_check">
							<input class="custom_input" type="radio" value="0" v-model="sex" name="sex" id="boy"> <label class="inline custom_input" for="boy">男</label>
						</div>
						<div class="div_check">
							<input class="custom_input" type="radio" value="1" v-model="sex" name="sex" id="girl"> <label class="inline custom_input" for="girl">女</label>
						</div>
					</div>
				</div>
				<div class="content_list" v-show="singinThenStatus === 1">
					<textarea id="autograph" v-model="autograph" placeholder="给自己一个简单的描述吧" rows="5"></textarea>
				</div>
				<div class="content_list" v-show="singinThenStatus === 2">
					<div class="tips">
						<i class="icon-smile"></i>
						<p class="desc">前往首页</p>
					</div>
				</div>
				<input type="button" ref="nextBtn" :value="singinThenStatus === 2 ? 'Ok':'下一步'" @click="nextSub">
			</div>
		</div>
	</div>
</template>
<script>
	import fecth from 'utils/fecth.js'
  import apiUserList from 'common/api/userApiList.js'
	export default {
		data () {
			return {
				// 0 是第一步。1 是第二步。2 是第三步
				singinThenStatus: 0,
        name: '',
				sex: '',
        autograph: ''
			}
		},
		props: {
			// 显示的正确内容
			userId: {
				type: String,
				default: ''
			}
		},
		methods: {
			nextSub () {
				if (this.singinThenStatus === 0) {
					this.updateUserSigninInfo()
					return
				}
				if (this.singinThenStatus === 1) {
					this.updateUserDesc()
					return
				}
				if (this.singinThenStatus === 2) {
					this.showSinginThen = false
					this.$emit('hidesingin')
					this.status = 0
          this.$router.push('/home/' + this.userId)
					return
				}
			},
			updateUserSigninInfo () {
				let reslutNickName = this.name.replace(/(^\s*)|(\s*$)/g, '')
				if (reslutNickName === '' || reslutNickName.includes(' ')) {
					this.$msg({text: '名字中间不能为空', background: 'red'})
					return
				}
				if (this.sex === '') return
				this.singinThenStatus = this.singinThenStatus + 1
			},
			updateUserDesc () {
					let fecthUrl = apiUserList.update
					fecth.postJson(fecthUrl, {
            name: this.name,
            sex: this.sex,
            autograph: this.autograph
					}).then((res) => {
						console.log(res.data)
						if (res.data.errcode === 0) {
							this.$msg({text: '恭喜，已激活注册的账号', background: '#00d032'})
							this.singinThenStatus ++
						}else {
              this.$msg({text: res.data.errmsg, background: '#00d032'})
            }
					}, (err) => {
						alert(`数据请求错误: ${JSON.stringify(res.data.errmsg)}`)
					})
			}
		}
	}
</script>
<style lang="stylus" rel="stylesheet/stylus">
</style>
