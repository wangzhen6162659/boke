import Vue from 'vue'
import Vuex from 'vuex'
import Fixedimage from './modules/fixedimage.js'
import GlobalInfo from './modules/global.js'
import PicList from './modules/pic.js'
import Router from './modules/router.js'
import Audio from './modules/audio.js'
import Other from './modules/other.js'
import ArticleList from './modules/articlelist.js'

Vue.use(Vuex)

const store = new Vuex.Store({
	modules: {
		fixedimage: Fixedimage,
		globalInfo: GlobalInfo,
		picList: PicList,
		router: Router,
		audio: Audio,
		other: Other,
    shareInfo: Other,
    articlelist: ArticleList
	}
})

export default store
