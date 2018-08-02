import store from 'store'
import fecth from '../../utils/fecth.js'
const globalStore = {
	state: {
		globalInfo: {
			// 路由的背景色 全屏状态下
			contentInfo: {
				opacity: '0.9',
				bgcolor: 'rgb(7, 17, 27)',
				type: 'radial-gradient-ellipse'
			},
			isHigher768: false,
			showBingImage: true
		},
		place: {},
		weather: {},
		showloading: true,
		musicRouter: '/music/playlist',
		host: 'http://www.daiwei.org',
		userInfo: null,
    empInfo: null,
    analyser: null
	},
	getters: {
		getGlobalInfo: state => state.globalInfo,
		getPlace: state => state.place,
		getShowLoading: state => state.showloading,
		getWeatherInfo: state => state.weather,
		getMusicRouter: state => state.musicRouter,
		getUserInfo: function(state){
      var user = fecth.getCookieValue('_user');
      if (state.userInfo == null && user.length>0){
        // console.log(JSON.parse(localStorage.getItem('FLASH_USER')))
        // state.userInfo = JSON.parse(localStorage.getItem('FLASH_USER'))
        state.userInfo = JSON.parse(user)
      }
      return state.userInfo;
    },
    getEmpInfo: function(state){
      state.empInfo = localStorage.getItem('FLASH_USER')
      return state.empInfo;
    },
    getAnalyser: state => state.analyser
	},
	mutations: {
		setGlobalInfo (state, obj) {
			state.globalInfo = obj.data
		},
		setIsHigher768 (state, obj) {
			state.globalInfo.isHigher768 = obj.data
		},
		setShowBingImage (state, obj) {
			state.globalInfo.showBingImage = obj.data
		},
		setGlobalBgColor (state, obj) {
			state.globalInfo.contentInfo.bgcolor = obj.data
		},
		setGlobaBglColorOpacity (state, obj) {
			state.globalInfo.contentInfo.opacity = obj.data
		},
		setMaskType (state, obj) {
			state.globalInfo.contentInfo.type = obj.data
		},
		setPlace (state, obj) {
			state.place = obj.data
		},
		setShowLoading (state, obj) {
			state.showloading = obj.data
		},
		setWeather (state, obj) {
			state.weather = obj.data
		},
		setMusicRouter (state, obj) {
			state.musicRouter = obj.data
		},
		setUserInfo (state, obj) {
			state.userInfo = obj.data
		},
    setEmpInfo (state, obj) {
      state.userInfo = obj.data
      localStorage.setItem('FLASH_USER',obj.data)//将value存储到key字段
    },
    setAnalyser (state, obj) {
      state.analyser = obj
    }
	},
	actions: {
		set_GlobalInfo ({commit}, obj) {
			commit('setGlobalInfo', obj)
		},
		set_ShowBingImage ({commit}, obj) {
			commit('setShowBingImage', obj)
		},
		set_GlobaBglColor ({commit}, obj) {
			commit('setGlobalBgColor', obj)
		},
		set_GlobaBglColorOpacity ({commit}, obj) {
			commit('setGlobaBglColorOpacity', obj)
		},
		set_MaskType ({commit}, obj) {
			commit('setMaskType', obj)
		},
		set_Place ({commit}, obj) {
			commit('setPlace', obj)
		},
		set_ShowLoading ({commit}, obj) {
			commit('setShowLoading', obj)
		},
		set_Weather ({commit}, obj) {
			commit('setWeather', obj)
		},
		set_MusicRouter ({commit}, obj) {
			commit('setMusicRouter', obj)
		},
		set_UserInfo ({commit}, obj) {
			commit('setUserInfo', obj)
		},
    set_EmpInfo ({commit}, obj) {
      commit('setEmpInfo', obj)
    },
    set_Analyser ({commit}, obj) {
      commit('setAnalyser', obj)
    }
	}
}

export default globalStore
